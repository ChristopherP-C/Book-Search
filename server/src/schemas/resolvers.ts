import { User } from '../models/index.js';
import { BookDocument } from '../models/Book.js';
import mongoose from 'mongoose';
import { signToken, AuthenticationError } from '../services/auth.js';


interface AddUserArgs {
    input:{
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
  }

interface AddBookArgs {
    userId: mongoose.Types.ObjectId;
    book: BookDocument;
}

interface RemoveBookArgs {
    userId: mongoose.Types.ObjectId;
    book: BookDocument;
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
              return await User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw AuthenticationError;
          },
    },
    Mutation: {
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });
            if (!user) {
              throw new AuthenticationError('Could not authenticate user.');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
              throw new AuthenticationError('Could not authenticate user.');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
          },
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: any, { userId, book }: AddBookArgs, context: any) => {
            try {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: userId },
                    { $addToSet: { savedBooks: book } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        } catch (err) {
            return console.error(err);
        }
        },
        removeBook: async (_parent: any, { book }: RemoveBookArgs, context: any) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: book } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        },
    },
};

export default resolvers;