const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require("./schema/schema");


app.use("/graphql", expressGraphQL({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('listening....')
})