import { filter, map, uniqBy } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { SearchNote, SlideIn } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { FretNote, Key, Note, TuningNote } from '../../../models';
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
  const {
    fretMap,
    searchArray,
    selectedMatrix,
    setSearchArray,
    setSelectedMatrix,
  } = useIndicatorsContext();

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

  const handleSetSelectedMatrix = (note: TuningNote) => {
    const filteredMatrix = map(selectedMatrix, (string: boolean[], s: number) =>
      map(string, (selected: boolean, f: number) => {
        return fretMap.Notes[s][f]?.Note.Pitch == note.Pitch ? false : selected;
      })
    );
    const filteredArray = filter(
      searchArray,
      (n) => n.Note.Pitch != note.Pitch
    );
    setSearchArray(filteredArray);
    setSelectedMatrix(filteredMatrix);
  };

  return (
    <SlideIn
      {...props}
      className="search"
      title={<h2>Search</h2>}
      loading={false}
    >
      <div className="search-query">
        {searchArray.length ? (
          map(getDisplayArray(searchArray), (n: FretNote, i: number) => (
            <SearchNote
              key={i}
              note={n}
              updateMatrix={handleSetSelectedMatrix}
            />
          ))
        ) : (
          <>Select some notes!</>
        )}
      </div>
      <div className="search-controls">
        <Button
          disabled={!searchArray.length}
          variant="outline"
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
