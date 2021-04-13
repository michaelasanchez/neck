import { map, uniqBy } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { SlideIn } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { FretNote, Key, Note } from '../../../models';
import { KeyApi } from '../../../network';
import { ISlideInProps } from './SlideIn';

export interface SearchSlideInProps extends Pick<ISlideInProps, 'collapse'> {}

const getDisplayArray = (searchArray: FretNote[]): FretNote[] => {
  return uniqBy(searchArray, (n: FretNote) => n.Note?.Pitch);
};

export const SearchSlideIn: React.FunctionComponent<SearchSlideInProps> = (
  props
) => {
  const { setAppOptions } = useAppOptionsContext();
  const { searchArray, setSearchArray } = useIndicatorsContext();

  const [keysQuery, setKeysQuery] = useState<FretNote[]>();
  const [keysResult, setKeysResult] = useState<Key[]>();

  const { req: searchKeys } = useRequest(new KeyApi().SearchAsync);

  const handleSetKey = (k: Key) => {
    // setIndicatorsOptions({ searchArray: map(searchArray, n => fretMap[n.])})
    // TODO: this is duplicated until we move props to indicatorsOptions
    // const mappedSearchArray = map(
    //   searchArray,
    //   (n: FretNote, i: number) => fretMap.Notes[n.String][n.Fret]
    // );
    setAppOptions({ key: k });
  };

  const handleSetKeys = () => {
    if (!!searchArray.length) {
      searchKeys(map(searchArray, (n) => n.Note)).then((keys) => {
        setKeysQuery(getDisplayArray(searchArray));
        setKeysResult(keys);
      });
    }
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
          map(getDisplayArray(searchArray), (n: FretNote, i: number) => (
            <label className="search-note" key={i}>
              {n.Note?.Label}
            </label>
          ))
        ) : (
          <>Select some notes!</>
        )}
      </p>
      <div className="search-controls">
        <Button
          disabled={!searchArray.length}
          variant="outline-secondary"
          onClick={() => setSearchArray([])}
        >
          Clear
        </Button>
        <Button disabled={!searchArray.length} onClick={() => handleSetKeys()}>
          Go
        </Button>
      </div>

      {!!keysResult && (
        <>
          <div className="results-header">
            <h4>Results</h4>
            <div>
              {map(keysQuery, (n: FretNote, i: number) => (
                <Badge pill variant="light" key={i}>
                  {n.Note?.Label}
                </Badge>
              ))}
            </div>
          </div>
          <h5>
            Keys <span className="text-muted">({keysResult.length})</span>
          </h5>
          <div className="key-result">
            {map(keysResult, (k: Key, i: number) => (
              <div key={i} onClick={() => handleSetKey(k)}>
                <h6>{k.LongLabel}</h6>
                {map(k.Scale.Notes, (n: Note, j: number) => (
                  <span key={j}>{n.Label}</span>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </SlideIn>
  );
};
