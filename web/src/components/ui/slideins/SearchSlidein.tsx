import * as React from 'react';
import { Button } from 'react-bootstrap';
import { SlideIn } from '.';
import { ISlideInProps } from './SlideIn';

export interface SearchSlideInProps extends Pick<ISlideInProps, 'collapse'> { }

export const SearchSlideIn: React.FunctionComponent<SearchSlideInProps> = (props) => {

  return <SlideIn
    {...props}
    title={<h2>Search</h2>}
    loading={false}
  >
    
    <Button>Go</Button>
  </SlideIn>
};
