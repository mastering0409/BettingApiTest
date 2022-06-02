import "reflect-metadata"
import { buildSchema } from "type-graphql"
import express from "express"
import { graphqlHTTP } from "express-graphql"

import { Resolvers } from "./resolvers/resolvers"

async function main() {
    const schema = await buildSchema({
        resolvers: [Resolvers],
        emitSchemaFile: true,
    })

    const app = express();

    app.use(
        "/graphql",
        graphqlHTTP({
            schema: schema,
            graphiql: true,
        })
    )

    app.listen(8000)

    console.log("Running a Graphql API server at http://localhost:8000/graphql")
}

main()
