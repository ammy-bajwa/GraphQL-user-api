const GraphQL = require("graphql");
const axios = require("axios");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = GraphQL;
const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        users: {
            type: new GraphQLList(UseType),
            resolve({
                id
            }, args) {
                return axios.get(`http://localhost:3000/companies/${id}/users`)
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        }
    })
});

const UseType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        company: {
            type: CompanyType,
            resolve({
                companyId
            }, args) {
                return axios.get(`http://localhost:3000/companies/${companyId}`)
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UseType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, {
                id
            }) {
                return axios.get(`http://localhost:3000/users/${id}`)
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        },
        company: {
            type: CompanyType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, {
                id
            }) {
                return axios.get(`http://localhost:3000/companies/${id}`)
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        }
    }
})


const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                },
                firstName: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                companyId: {
                    type: GraphQLString
                }
            },
            resolve(parentValues, {
                firstName,
                age
            }) {
                return axios.post("http://localhost:3000/users", {
                        firstName,
                        age
                    })
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parentValues, {
                id
            }) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                firstName: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                },
                companyId: {
                    type: GraphQLString
                }
            },
            resolve(parentValues, {
                id,
                firstName,
                age,
                companyId
            }) {
                return axios.patch(`http://localhost:3000/users/${id}`, {
                        firstName,
                        age,
                        companyId
                    })
                    .then(res => res.data)
                    .catch(err => console.log(err))
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})