import React from "react";
import styled from "styled-components";
import convertGenres from "../functions/convertGenres";

//types
import { BookInfo, DbBookInfo } from "../types";

/*Short display: Img / Title / Subtitle / Authors / Genres / (Status / Date Read)
Full Display (includes above): Page Count / Language / Published Date / Description / Preview Link */

// displays book of Google Books format
export const DisplayDbBook = ({
  item,
  format,
}: {
  item: DbBookInfo;
  format: string;
}) => {
  return (
    <BookInfoCard key={item.id}>
      {format && format === "short" ? (
        <ShortFormBookInfo>
          {item.img && <img src={item.img} alt={`Cover of ${item.title}`} />}
          <div>
            {item.title && (
              <h2>
                {item.title.length <= 65
                  ? item.title
                  : item.title.substring(0, 65) + "..."}
              </h2>
            )}
            {item.subtitle && (
              <h3>
                {item.subtitle.length <= 65
                  ? item.subtitle
                  : item.subtitle.substring(0, 65) + "..."}
              </h3>
            )}
            {item.author && (
              <h3>
                By:{" "}
                {item.author.length <= 65
                  ? item.author
                  : item.author.substring(0, 65) + "..."}
              </h3>
            )}
            {item.genre && (
              <h4>
                Genre:{" "}
                {item.genre.length <= 65
                  ? item.genre
                  : item.genre.substring(0, 65) + "..."}
              </h4>
            )}
          </div>
        </ShortFormBookInfo>
      ) : (
        <>
          <ShortFormBookInfo>
            {item.img && <img src={item.img} alt={`Cover of ${item.title}`} />}
            <div>
              {item.title && <h2>{item.title}</h2>}
              {item.subtitle && <h3>{item.subtitle}</h3>}
              {item.author && <h3>By: {item.author}</h3>}
              {item.genre && <h4>Genre: {item.genre}</h4>}
            </div>
          </ShortFormBookInfo>

          <FullFormBookInfo>
            {item.pageCount && <h4>Pages: {item.pageCount}</h4>}
            {item.language && <h4>Language: {item.language}</h4>}
            {item.publishedDate && (
              <h4>Date Published: {item.publishedDate}</h4>
            )}
            {item.desc && <p>Description: {item.desc}</p>}

            {item.previewLink && (
              <a href={item.previewLink} target="_blank" rel="noreferrer">
                Preview on Google Books
              </a>
            )}
          </FullFormBookInfo>
        </>
      )}
    </BookInfoCard>
  );
};

// displays book of Google Books format
export const DisplayGoogleBook = ({
  item,
  format,
}: {
  item: BookInfo;
  format: string;
}) => {
  let newGenreString: string | undefined;
  if (item.volumeInfo.categories) {
    newGenreString = convertGenres(item.volumeInfo.categories);
  }
  return (
    <BookInfoCard key={item.id}>
      {format && format === "short" ? (
        <ShortFormBookInfo>
          {item.volumeInfo.imageLinks && (
            <img
              src={item.volumeInfo.imageLinks.smallThumbnail}
              alt={`Cover of ${item.volumeInfo.title}`}
            />
          )}
          <div>
            {item.volumeInfo.title.length <= 65 ? (
              <h2>{item.volumeInfo.title}</h2>
            ) : (
              <h2>{item.volumeInfo.title.substring(0, 65)}...</h2>
            )}
            {item.volumeInfo.subtitle && (
              <>
                (
                {item.volumeInfo.subtitle.length <= 65 ? (
                  <h3>{item.volumeInfo.subtitle}</h3>
                ) : (
                  <h3>{item.volumeInfo.subtitle.substring(0, 65)}...</h3>
                )}
                )
              </>
            )}

            {item.volumeInfo.authors ? (
              <h3>
                By:{" "}
                {item.volumeInfo.authors.join(", ").length <= 65
                  ? item.volumeInfo.authors.join(", ")
                  : item.volumeInfo.authors.join(", ").substring(0, 65) + "..."}
              </h3>
            ) : null}
            {newGenreString && (
              <h4>
                {newGenreString.length <= 65
                  ? newGenreString
                  : newGenreString.substring(0, 65) + "..."}
              </h4>
            )}
          </div>
        </ShortFormBookInfo>
      ) : (
        <>
          <ShortFormBookInfo>
            {item.volumeInfo.imageLinks && (
              <img
                src={item.volumeInfo.imageLinks.smallThumbnail}
                alt={`Cover of ${item.volumeInfo.title}`}
              />
            )}
            <div>
              {item.volumeInfo.title && <h2>{item.volumeInfo.title}</h2>}
              {item.volumeInfo.subtitle && <h3>{item.volumeInfo.subtitle}</h3>}

              {item.volumeInfo.authors && (
                <h3>By: {item.volumeInfo.authors.join(", ")}</h3>
              )}

              {newGenreString && <h4>{newGenreString}</h4>}
            </div>
          </ShortFormBookInfo>
          <FullFormBookInfo>
            {item.volumeInfo.pageCount && (
              <h4>Pages: {item.volumeInfo.pageCount}</h4>
            )}
            {item.volumeInfo.language && (
              <h4>Language: {item.volumeInfo.language}</h4>
            )}
            {item.volumeInfo.publishedDate && (
              <h4>Date Published: {item.volumeInfo.publishedDate}</h4>
            )}
            {item.volumeInfo.description && (
              <p>Description: {item.volumeInfo.description}</p>
            )}
            {item.volumeInfo.previewLink && (
              <a
                href={item.volumeInfo.previewLink}
                target="_blank"
                rel="noreferrer"
              >
                Preview on Google Books
              </a>
            )}
          </FullFormBookInfo>
        </>
      )}
    </BookInfoCard>
  );
};

// styled components
const BookInfoCard = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.colors.whiteText};
  border: 2px solid ${(props) => props.theme.colors.secondary};
  height: 87%;
`;
const ShortFormBookInfo = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 0.8em;
  padding: 0.5em;

  img {
    width: 85px;
    padding-top: 0.8em;
  }

  h2,
  h3,
  h4 {
    padding: 0.3em 0;
    line-height: 1.3;
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1rem;
  }
  h4 {
    font-size: 0.7rem;
  }
`;

const FullFormBookInfo = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: 0.5em;

  h4,
  p,
  a {
    font-size: 0.8rem;
  }
  a {
    color: ${(props) => props.theme.colors.secondary};
  }
`;
