import { gql } from '@apollo/client';

export const LOFIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        }
    }
}
`;

export const ADD_USER = gql`
    mutation addUser($input: UserInput!) {
    addUser(input: $input) {
        token
        user {
        _id
        username
        }
    }
}
`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
        _id
        username
        email
        bookCount
        savedBooks {
        bookId
        authors
        description
        title
        image
        link
        }
    }
}
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
        _id
        username
        email
        bookCount
        savedBooks {
        bookId
        authors
        description
        title
        image
        link
        }
    }
}
`;