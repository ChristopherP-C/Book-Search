const typeDefs = `
    type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]
    }

    type Book {
    _id: ID!
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
    }

    type Query {
    me: User
    }

    type Auth {
    token: ID!
    user: User
    }

    input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
    }

    input UserInput {
    username: String!
    email: String!
    password: String!
  }

    type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: string!): User
    }
`;

export default typeDefs;