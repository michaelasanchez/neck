import { map } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { SlideIn } from '.';
import { useIndicatorsContext } from '../..';
import { useRequest } from '../../../hooks';
import { TuningNote } from '../../../models';
import { KeyApi } from '../../../network';
import { ISlideInProps } from './SlideIn';

export interface SearchSlideInProps extends Pick<ISlideInProps, 'collapse'> { }

export const SearchSlideIn: React.FunctionComponent<SearchSlideInProps> = (props) => {
  const { searchArray } = useIndicatorsContext();

  const { req: getKeys } = useRequest(new KeyApi().Search);

  const handleGetKeys = () => {
    getKeys(searchArray).then(keys => {
      console.log('wowowie', keys);
    })
  }

  return <SlideIn
    {...props}
    title={<h2>Search</h2>}
    loading={false}
  >
    <p className="text-center">
      {searchArray.length
        ? map(searchArray, (n: TuningNote, i: number) => <label key={i}>{n.Label}</label>)
        : <>Select some notes!</>}
    </p>
    <Button onClick={() => handleGetKeys()}>Go</Button>
  </SlideIn>
};
