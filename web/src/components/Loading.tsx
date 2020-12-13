import { map } from 'lodash';
import * as React from 'react';
import { Alert, Spinner } from 'react-bootstrap';

const DEFAULT_LOADING_TEXT = 'Loading...';

export type bsVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface IError {
  message: string;
}

interface LoadingProps {
  errors?: IError[];
  loadingText?: string;
  showLoadingText?: boolean;
  variant?: bsVariant;
}

export const Loading: React.FC<LoadingProps> = ({
  errors,
  loadingText,
  showLoadingText = true,
  variant = 'primary',
}) => {
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
    <div className="h-100 d-flex flex-column align-items-center justify-content-center align-self-center">
      {errors?.length ? (
        renderErrors(errors)
      ) : (
        <>
          <Spinner animation="border" variant={variant} className="m-3" />
          {showLoadingText && <span>{loadingText || DEFAULT_LOADING_TEXT}</span>}
        </>
      )}
    </div>
  );
};
