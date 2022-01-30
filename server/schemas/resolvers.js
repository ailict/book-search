const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('books');
    },
    getUser: async (parent, { username }) => {
      return User.findOne({ username }).populate('books');
    },
    getSavedBooks: async (parent, { username }) => {
      return User.findOne({ username }).populate('books');
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('login');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect login');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { content }, context) => {
			if (context.user) {
				const user = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { savedBooks: content } },
					{ new: true }
				);

				return user;
			}
		},

    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId} } },
          { new: true }
        );
        return book;
      }
      throw new AuthenticationError('Please log in');
    },
  },
};

module.exports = resolvers;