import { filter, map, uniqBy } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { SlideIn } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { FretNote, Key, Note, TuningNote } from '../../../models';
import { KeyApi } from '../../../network';
import { ISlideInProps } from './SlideIn';

export interface SearchSlideInProps extends Pick<ISlideInProps, 'collapse'> {}

export const SearchSlideIn: React.FunctionComponent<SearchSlideInProps> = (
  props
) => {
  const { setAppOptions } = useAppOptionsContext();
  const { searchArray } = useIndicatorsContext();

  const [keysQuery, setKeysQuery] = useState<FretNote[]>();
  const [keysResult, setKeysResult] = useState<Key[]>();

  const { req: searchKeys } = useRequest(new KeyApi().Search);

  const handleSearchKeys = () => {
    searchKeys(searchArray).then((keys) => {
      setKeysQuery([...searchArray]);
      setKeysResult(keys);
    });
  };

  return (
    <SlideIn
      {...props}
      className="search"
      title={<h2>Search</h2>}
      loading={false}
    >
      <p className="text-center">
        {searchArray.length ? (
          map(uniqBy(searchArray, 'Pitch'), (n: TuningNote, i: number) => (
            <label className="search-note" key={i}>
              {n.Label}
            </label>
          ))
        ) : (
          <>Select some notes!</>
        )}
      </p>
      {!!keysResult && (
        <>
          <div className="key-header">
            <h5>
              Matching Keys{' '}
              <span className="text-muted">({keysResult.length})</span>
            </h5>
            <div>
              {map(keysQuery, (n) => (
                <Badge pill variant="light">
                  {n.Note.Label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="key-result">
            {map(keysResult, (k: Key, i: number) => (
              <div key={i} onClick={() => setAppOptions({ key: k })}>
                <h6>{k.Label}</h6>
                {map(k.Scale.Notes, (n: Note, j: number) => (
                  <span key={j}>{n.Label}</span>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
      <Button onClick={() => handleSearchKeys()}>Go</Button>
    </SlideIn>
  );
};
