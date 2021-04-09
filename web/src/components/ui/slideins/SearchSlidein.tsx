import { map } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { SlideIn } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { Key, Note, TuningNote } from '../../../models';
import { KeyApi } from '../../../network';
import { ISlideInProps } from './SlideIn';

export interface SearchSlideInProps extends Pick<ISlideInProps, 'collapse'> { }

export const SearchSlideIn: React.FunctionComponent<SearchSlideInProps> = (props) => {
  const { setAppOptions } = useAppOptionsContext();
  const { searchArray } = useIndicatorsContext();

  const [keys, setKeys] = useState<Key[]>();

  const { req: getKeys } = useRequest(new KeyApi().Search);

  const handleGetKeys = () => {
    getKeys(searchArray).then(keys => {
      setKeys(keys);
    })
  }

  return <SlideIn
    {...props}
    className="search"
    title={<h2>Search</h2>}
    loading={false}
  >
    <p className="text-center">
      {searchArray.length
        ? map(searchArray, (n: TuningNote, i: number) => <label className="search-note" key={i}>{n.Label}</label>)
        : <>Select some notes!</>}
    </p>
    {!!keys && <><h5>Matching Keys <span className="text-muted">({keys.length})</span></h5>
      <div className="key-container">
        {map(keys, (k: Key, i: number) =>
          <p key={i} onClick={() => setAppOptions({ key: k })}>
            <h6>{k.Label}</h6>
            {map(k.Scale.Notes, (n: Note, j: number) => <span key={j}>{n.Label}</span>)}
          </p>
        )}
      </div>
    </>
    }
    <Button onClick={() => handleGetKeys()}>Go</Button>
  </SlideIn >
};
