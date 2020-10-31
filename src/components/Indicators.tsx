import { each, filter, find, map, min, reduce, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { Chord, ChordModifier, Note, Tuning } from '../models';
import {
  ChordForm,
  ChordFormType,
  mapTypeToPositions,
} from '../models/chordForm';
import { IAppOptions } from '../shared';

export const START_DEFAULT = 0;
export const RANGE_DEFAULT = 4;

interface IndicatorsProps {
  options: IAppOptions;
}

// Returns a fret number based on a Note, tuning
//  offset and an optional minimum fret position
const calcNotePosition = (
  note: Note,
  offset: number,
  min: number = 0
): number => {
  let pos = (note.Modified - offset + Note.NUM_NOTES) % Note.NUM_NOTES;
  while (pos < min) pos += Note.NUM_NOTES;
  return pos;
};

// Returns an array of of possible note positions
//  with a specified range that form a chord
const calcVariations = (
  chord: Chord,
  tuning: Tuning,
  start: number = START_DEFAULT,
  range: number = RANGE_DEFAULT
): number[][] => {
  // Notes that fall within start and start + range
  const matches = map(tuning.Offsets, (o: number, i: number) => {
    return filter(chord.Pitches, (n) => {
      let pos = calcNotePosition(n, o, start);
      return pos >= start && pos <= start + range;
    });
  });

  // Calculate number of combinations from matched notes
  const potentialNotes = map(matches, (m) => m.length);
  const numVariations = reduce(potentialNotes, (acc, next) => acc * next);

  // Calculate variations
  let variations: number[][] = [];
  times(numVariations, (n) => {
    let multiplier = 1;
    const newVariation = map(potentialNotes, (p, i) => {
      const prev = multiplier;
      multiplier *= p;

      const index = Math.floor(n / prev) % p;
      return calcNotePosition(matches[i][index], tuning.Offsets[i], start);
    });

    variations.push(newVariation);
  });

  return variations;
};

const matchesChordForm = function (
  variation: number[],
  form: ChordFormType
): boolean {
  const start = min(variation);
  const formPositions = mapTypeToPositions(form);

  let matches = true;
  each(variation, (pos: number, i: number) => {
    if (pos - start !== formPositions[i] && formPositions[i] !== null) {
      matches = false;
      return false;
    }
  });

  return matches;
};

const buttonStyle: React.CSSProperties = {
  position: 'fixed',
  width: 100,
  height: 40,
  top: 10,
  left: 10,
};

const prevStyle: React.CSSProperties = {
  ...buttonStyle,
  left: 10,
};

const nextStyle: React.CSSProperties = {
  ...buttonStyle,
  left: 120,
};

export const Indicators: React.FunctionComponent<IndicatorsProps> = ({
  options,
}) => {
  const { tuning, numFrets } = options;

  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0);
  const [variations, setVariations] = useState<number[][]>();

  // Init
  useEffect(() => {
    // Test Chord
    const chord = new Chord(Note.C(), ChordModifier.Major);
    const variations: number[][] = [];

    // Generate chord variations
    times(10, (n) => {
      variations.push(...calcVariations(chord, tuning, n));
    });

    // Only keep variations that match a chord form
    const filteredVariations: number[][] = filter(
      map(ChordForm.AllChordFormTypes(), (chordForm) =>
        find(variations, (v) => matchesChordForm(v, chordForm))
      )
    );

    setVariations(filteredVariations);
  }, []);

  const renderDebug = () => {
    if (!variations) {
      return <></>;
    }

    const getNextVariationIndex = (next: number): number =>
      (currentVariationIndex + variations.length + next) % variations.length;

    return (
      <>
        <Button
          disabled={!variations.length}
          style={prevStyle}
          onClick={() => setCurrentVariationIndex(getNextVariationIndex(-1))}
        >
          Prev
        </Button>
        <Button
          disabled={!variations.length}
          style={nextStyle}
          onClick={() => setCurrentVariationIndex(getNextVariationIndex(1))}
        >
          Next
        </Button>
      </>
    );
  };

  const renderIndicator = (stringIndex: number, fretNum: number) => {
    return (
      <div className={`fret${fretNum === 0 ? ' open' : ''}`} key={fretNum}>
        {variations[currentVariationIndex][stringIndex] === fretNum && (
          <div className="indicator"></div>
        )}
      </div>
    );
  };

  const renderIndicators = variations && variations.length > 0;
  return (
    <div className="indicators">
      {renderDebug()}
      {renderIndicators &&
        map(tuning.Offsets, (s: number, i: number) => {
          return (
            <div className="string" key={i}>
              {renderIndicator(i, 0)}
              {times(numFrets, (f: number) => renderIndicator(i, f + 1))}
            </div>
          );
        })}
    </div>
  );
};
