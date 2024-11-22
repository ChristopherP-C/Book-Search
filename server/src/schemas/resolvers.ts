import { User } from '../models/index.js';
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
        saveBook: async (_parent: any, { bookData }: any, context: any) => {
            try {
                console.log(bookData);
                if (context.user) {
                console.log('Hello World');
                console.log(bookData);
                console.log('resolver')
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true }
                );
                console.log(savedBooks);
            }
            throw AuthenticationError;
        } catch (err) {
            return console.error(err);
        }
        },
        removeBook: async (_parent: any, { bookId }: any, context: any) => {
            try{
            console.log(bookId);
            console.log(context.user);
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        } catch (err) {
            return console.error(err);
        }
        },
    },
};

export default resolvers;