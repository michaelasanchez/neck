import { filter, map, uniqBy } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { ToolPanel } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { FretNote, Key, Note, TuningNote } from '../../../models';
import { KeyApi } from '../../../network';
import { SearchNote } from '../slideins/SearchNote';
import { ToolPanelProps } from './ToolPanel';

export interface SearchPanelProps
  extends Pick<ToolPanelProps, 'className' | 'collapse'> {}

const getDisplayArray = (searchArray: FretNote[]): FretNote[] => {
  return uniqBy(searchArray, (n: FretNote) => n.Note?.Pitch);
};

export const SearchPanel: React.FunctionComponent<SearchPanelProps> = (
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

  const handleSetKey = (k: Key) => setAppOptions({ key: k });

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
    <ToolPanel className={`search ${props.className}`} title="Search">
      <div className="search-query">
        {searchArray.length ? (
          map(getDisplayArray(searchArray), (n: FretNote, i: number) => (
            <SearchNote
              key={i}
              note={n}
              onClose={() => handleSetSelectedMatrix(n?.Note)}
            />
          ))
        ) : (
          <>Select some notes!</>
        )}
      </div>
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
                  {n?.Label}
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
    </ToolPanel>
  );
};
