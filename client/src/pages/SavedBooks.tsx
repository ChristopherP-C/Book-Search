import { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { Navigate, useParams } from 'react-router-dom';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    savedBooks: [],
  });
  
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  const { loading, data } = useQuery(GET_ME);
  //   , {
  //   variables: { userId: userId },
  // });
  
  const user = data?.me || {};
  
  const [deleteBook, { error }] = useMutation(REMOVE_BOOK, {
    refetchQueries: [
      GET_ME,
      `me`
    ]
  });
  
  if (!Auth.loggedIn()) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      cosole.log('No token found!');
      return false;
    }

    try {
      console.log('bookId:', bookId);
      console.log('token:', token);
      await deleteBook({
        variables: { bookId },
      });

      if (error) {
        throw new Error('something went wrong!');
      }

      removeBookId(bookId);
      // setUserData({
      //   ...user,
      //   savedBooks: userData.savedBooks.filter((savedBook) => savedBook.bookId !== bookId),
      // });
    } catch (err) {
      console.error(err);
    }
  };

  //const { userId } = useParams();



  // if (Auth.loggedIn() && (Auth.getProfile() as any).data.username === userId) {
  //   return <Navigate to='/saved' />;
  // }


  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {user.username ? (
            <h1>Viewing {user.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {user.savedBooks.length
            ? `Viewing ${user.savedBooks.length} saved ${
                user.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {user.savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
