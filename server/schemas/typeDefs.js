const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: string
    email: string
    password: string
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID!
    title: string
    authors: [string]
    link: string
    description: string
    image: string
  }

	input bookContent {
    bookId: ID!
    title: string
    authors: [string]
    link: string
    description: string
    image: string
	}

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    getUser(username: string!): User
    getSavedBooks(username: string!): User
    me: User
  }

  type Mutation {
    createUser(username: string!, email: string!, password: string!): Auth
    login(email: string!, password: string!): Auth
    saveBook(content: bookContent!): User
    # saveBook(userId:ID! title: string!, authors: [string], bookId: string, description: string image: string ): User
    deleteBook(bookId: ID!): User
  }
`;