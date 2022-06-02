import { Query, Resolver, Mutation, Arg } from "type-graphql"
import { UserInput, User, BetInput, Bet, UserUpdate } from "../schemas/schemas"

@Resolver(() => User)
@Resolver(() => Bet)
export class Resolvers {

    private users: User[] = [
    ]
    private bets: Bet[] = [
    ]

    //User Resolvers
    @Query(() => [User])
    async getUsers(): Promise<User[]> {
        return this.users
    }

    @Query(() => User)
    async getUser(@Arg("id") id: number): Promise<User | undefined> {
        const user = this.users.find(u => u.id === id)
        return user
    }

    @Mutation(() => User)
    async createUser(@Arg("input") input: UserInput): Promise<User> {
        const user = {
            id: this.users.length + 1,
            ...input,
        }

        this.users.push(user)
        return user
    }

    @Mutation(() => User)
    async updateUserBalance(
        @Arg("input") input: UserUpdate
    ): Promise<User> {

        const updatedUser = {
            ...input,
        }

        this.users = this.users.map(u => (u.id === input.id ? updatedUser : u))

        return updatedUser
    }

    //Bet Resolvers
    @Query(() => [Bet])
    async getBets(): Promise<Bet[]> {
        return this.bets
    }

    @Query(() => Bet)
    async getBet(@Arg("id") id: number): Promise<Bet | undefined> {
        const bet = this.bets.find(u => u.id === id)
        return bet
    }

    @Query(() => [Bet])
    async getBestBetUser(@Arg("limit") limit: number): Promise<Bet[] | undefined> {
        var get_best_per_users
        for (let i = 0; i < this.users.length; i++) {
            get_best_per_users = this.bets.filter(u => u.userId === i + 1).sort((u => u.betAmount)).reverse().slice(0, limit)
        }
        return get_best_per_users
    }

    @Mutation(() => Bet)
    async createBet(@Arg("input") input: BetInput): Promise<Bet | undefined> {

        var bet
        for (let i = 0; i < input.chance; i++) {
            const betUserAmount = Math.floor(Math.random() * 100) + 1
            const userWin = (betUserAmount > input.betAmount) ? true : false
            bet = {
                id: this.bets.length + 1,
                userId: input.userId,
                betAmount: betUserAmount,
                chance: input.chance - i,
                payout: input.payout,
                win: userWin,
            }
            this.bets.push(bet)
            if (betUserAmount > input.betAmount) {
                const check_user = this.users.find(u => u.id === input.userId)
                if (check_user) {
                    this.updateUserBalance({
                        id: check_user.id,
                        name: check_user.name,
                        balance: check_user.balance + input.payout
                    })
                } else {
                    this.createUser({
                        name: "username",
                        balance: input.payout
                    })
                }
                return bet
            }
        }

        const check_user = this.users.find(u => u.id === input.userId)
        if (!check_user) {
            this.createUser({
                name: "username",
                balance: 0 - input.payout
            })
        }
        if (check_user) {
            this.updateUserBalance({
                id: check_user.id,
                name: check_user.name,
                balance: check_user.balance - input.payout
            })
        }
        return bet
    }
}