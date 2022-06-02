import { Field, ObjectType, InputType } from "type-graphql"

//userschemas

@ObjectType()
export class User {
    @Field()
    id!: number
    @Field()
    name!: string
    @Field()
    balance!: number
}

@InputType()
export class UserInput implements Pick<User, "name"> {
    @Field()
    name!: string
    @Field()
    balance!: number
}

@InputType()
export class UserUpdate implements Pick<User, "id" | "balance"> {
    @Field()
    id!: number
    @Field()
    name!: string
    @Field()
    balance!: number
}

//betschemas

@ObjectType()
export class Bet {
    @Field()
    id!: number
    @Field()
    userId!: number
    @Field()
    betAmount!: number
    @Field()
    chance!: number
    @Field()
    payout!: number
    @Field()
    win!: boolean
}

@InputType()
export class BetInput implements Pick<Bet, "userId" | "betAmount" | "chance" | "payout"> {
    @Field()
    userId!: number
    @Field()
    betAmount!: number
    @Field()
    chance!: number
    @Field()
    payout!: number
}