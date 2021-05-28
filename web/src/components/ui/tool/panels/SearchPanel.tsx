import { filter, map, uniqBy } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { ToolPanel, ToolPanelProps } from '.';
import { PanelDropdown } from '..';
import { useIndicatorsContext } from '../../..';
import { useAppOptionsContext } from '../../../..';
import { useRequest } from '../../../../hooks';
import { Chord, FretNote, Key, Note, TuningNote } from '../../../../models';
import { ChordApi, KeyApi } from '../../../../network';
import { SearchNote } from '../../slideins/SearchNote';

export enum SearchMode {
  Chords,
  Keys,
  //Scales
}

const DefaultSearchMode = SearchMode.Chords;

export interface SearchPanelProps
  extends Pick<ToolPanelProps, 'className' | 'collapse' | 'docked'> {}

const getDisplayArray = (searchArray: FretNote[]): FretNote[] => {
  return uniqBy(searchArray, (n: FretNote) => n.Note?.Pitch);
};

export const SearchPanel: React.FunctionComponent<SearchPanelProps> = (
  props
) => {
  const { className } = props;
  const { setAppOptions } = useAppOptionsContext();
  const {
    fretMap,
    searchArray,
    selectedMatrix,
    setSearchArray,
    setSelectedMatrix,
  } = useIndicatorsContext();

  const [searchMode, setSearchMode] = useState<SearchMode>(DefaultSearchMode);

  const [query, setQuery] = useState<FretNote[]>();

  const [chordsResult, setChordsResult] = useState<Chord[]>();
  const [keysResult, setKeysResult] = useState<Key[]>();

  const { req: searchChords } = useRequest(new ChordApi().SearchAsync);
  const { req: searchKeys } = useRequest(new KeyApi().SearchAsync);

  const handleSetKey = (k: Key) => setAppOptions({ key: k });

  const handleSubmitQuery = () => {
    if (!!searchArray.length) {
      switch (searchMode) {
        case SearchMode.Keys:
          searchKeys(map(searchArray, (n) => n.Note)).then((keys) => {
            setQuery(getDisplayArray(searchArray));
            setKeysResult(keys);
          });
          break;
        case SearchMode.Chords:
          searchChords(map(searchArray, (n) => n.Note)).then((chords) => {
            setQuery(getDisplayArray(searchArray));
            setChordsResult(chords);
          });
          break;
        default:
          console.error('Something is wrong'); // TODO: debug
      }
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

  const searchOptions = [
    { label: 'Chords', value: SearchMode.Chords },
    { label: 'Keys', value: SearchMode.Keys },
  ]; //, { label: 'Scales', value: 'scale' }];

  /* ButtonGroup */
  const buttonGroup = (
    <>
      <PanelDropdown
        active={searchOptions[searchMode]} // TODO: this only works because SearchMode enum matches options array
        options={searchOptions}
        onSelect={setSearchMode}
      />
    </>
  );

  const renderResults = () => {
    switch (searchMode) {
      case SearchMode.Keys:
        return (
          <>
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
        );
      case SearchMode.Chords:
        console.log(chordsResult);
        return (
          <>
            <h5>
              Chords <span className="text-muted">({chordsResult.length})</span>
            </h5>
            <div className="chord-result">
              {map(chordsResult, (c: Chord, i: number) => (
                <div key={i}>
                  <h6>{c.Label}</h6>
                  {map(c.Tones, (n: Note, j: number) => (
                    <span key={j}>{n.Label}</span>
                  ))}
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <ToolPanel
      {...props}
      className={`search ${className}`}
      title="Search"
      buttonGroup={buttonGroup}
    >
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
        <Button
          disabled={!searchArray.length}
          onClick={() => handleSubmitQuery()}
        >
          Go
        </Button>
      </div>

      {(!!keysResult || !!chordsResult) && (
        <>
          <div className="results-header">
            <h4>Results</h4>
            <div>
              {map(query, (n: FretNote, i: number) => (
                <Badge pill variant="light" key={i}>
                  {n?.Label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="results-body">{renderResults()}</div>
        </>
      )}
    </ToolPanel>
  );
};
