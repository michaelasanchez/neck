import { map } from 'lodash';
import * as React from 'react';
import { Alert, Spinner } from 'react-bootstrap';

export interface IError {
  message: string;
}

interface LoadingProps {
  errors?: any[];
}

export const Loading: React.FC<LoadingProps> = ({ errors }) => {
  const renderErrors = (errors: IError[]) => {
    return (
      <>
        {/* <p>Something went wrong...</p> */}
        {map(errors, (err: IError, i: number) => {
          return (
            <Alert key={i} variant="danger">
              {err.message}
            </Alert>
          );
        })}
      </>
    );
  };

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center">
      {errors?.length ? (
        renderErrors(errors)
      ) : (
        <>
          <Spinner animation="border" variant="primary" className="m-3" />
          <span>Loading...</span>
        </>
      )}
    </div>
  );
};
