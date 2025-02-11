import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import styled from "styled-components";

// style sheet for react-day-picker imported in App.tsx

// components
import { DisplayDbBook } from "../components/DisplayBook";
import Button from "../components/Button";
import BookshelfOptionsFieldset from "../components/BookshelfOptionsFieldset";
import ErrorMessage from "../components/ErrorMessage";

//functions
import { convertDateToString } from "../functions/convertDateToString";

//hooks
import useUserId from "../hooks/useUserId";
import useBookInDb from "../hooks/useBookInDb";

// types
import { DbBookInfo } from "../types";
import { device } from "../styles/Breakpoints";

// displays select info on the book and allows the user to modify the status of the book in the db
const UpdateBook: React.FC = () => {
  const navigate = useNavigate();

  // get book info from location and extract and save bookInfo object, selectedStatus, and bookId string in variables
  const { state } = useLocation();
  const bookInfo: DbBookInfo = state.bookInfo; // bookInfo Object
  const bookId: string = bookInfo.bookid;
  const selectedStatus: string = state.selectedStatus; // bookshelf status to change to

  // get userid of current user
  const { data: user } = useUserId();
  const userId: number = user?.id;

  //  get book from db that matches bookId
  const bookData = useBookInDb(bookId, userId, bookInfo);

  // for the bookshelf category selected by the user
  const [bookshelf, setBookshelf] = useState<string | undefined>(
    selectedStatus
  );

  // for the day selected by user in DayPicker
  const [dateRead, setDateRead] = useState<Date>();

  // to update the book info in the db
  const updateBook = (
    book: DbBookInfo | undefined,
    bookId: string | undefined,
    userId: number | undefined
  ) => {
    return axios.put(
      `http://localhost:5000/api/books/${bookId}/users/${userId}`,
      book
    );
  };
  const mutation = useMutation({
    mutationFn: ({
      book,
      bookId,
      userId,
    }: {
      book: DbBookInfo | undefined;
      bookId: string | undefined;
      userId: number | undefined;
    }) => updateBook(book, bookId, userId),
  });

  // when radio button selection changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.checked) {
      setBookshelf(target.value);
    }
  };

  // when user clicks save button to save book details from form
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const bookInDb: DbBookInfo = bookData.data[0];
    if (dateRead) {
      bookInDb.dateRead = convertDateToString(dateRead);
    }
    bookInDb.status = bookshelf;

    mutation.mutate({ book: bookInDb, bookId, userId });
  };

  return (
    <Wrapper>
      <div>
        {mutation.isSuccess ? null : (
          <Button onClick={() => navigate(-1)}>Back</Button>
        )}
        <DisplayDbBook item={bookInfo} format={"short"} />
      </div>
      {mutation.isSuccess ? (
        <SuccessMessage>Book updated!</SuccessMessage>
      ) : (
        <StyledForm className="optionsForm" onSubmit={handleSubmit}>
          <BookshelfOptionsFieldset
            bookshelf={bookshelf}
            handleChange={handleChange}
            dateRead={dateRead}
            setDateRead={setDateRead}
          />

          <Button type="submit">Update</Button>
          {bookData.isError && (
            <ErrorMessage>
              Error: {(bookData.error as Error).message}
            </ErrorMessage>
          )}
        </StyledForm>
      )}

      {mutation.isLoading ? (
        "Adding book to bookshelf..."
      ) : (
        <>
          {mutation.isError ? (
            <ErrorMessage>
              An error occurred: {(mutation.error as Error).message}
            </ErrorMessage>
          ) : null}
        </>
      )}
    </Wrapper>
  );
};

export default UpdateBook;

// styled components
const Wrapper = styled.div`
  max-width: 1200px;
  width: 89%;
  min-height: 85vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  button {
    max-width: 75px;
    margin-top: 1em;
    margin-bottom: 1.5em;
  }
  article {
    padding: 0.5em 0.5em 1em 0.5em;
  }
`;
const StyledForm = styled.form`
  button {
    max-width: 100px;
    margin-top: 0;
  }
`;
const SuccessMessage = styled.h2`
  text-align: center;
  font-size: 1.8rem;

  @media ${device.tablet} {
    font-size: 2.2rem;
  }
`;
