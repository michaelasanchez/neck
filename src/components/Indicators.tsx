import { each, filter, isEqual, map, min, reduce, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Chord, ChordType, IOptions, Note, Tuning } from '../models';
import {
  ChordForm,
  ChordFormType,
  mapTypeToPositions,
} from '../models/ChordForm';

export const START_DEFAULT = 0;
export const RANGE_DEFAULT = 4;

interface IndicatorsProps {
  options: IOptions;
}

// Returns a fret number based on note, tuning
//  and a minimum fret position
const calcNotePosition = (
  note: Note,
  offset: number,
  min: number = 0
): number => {
  let pos = (note.Modified - offset + Note.NUM_NOTES) % Note.NUM_NOTES;
  while (pos < min) pos += Note.NUM_NOTES;
  return pos;
};

// Returns an array of
const calcVariations = (
  chord: Chord,
  tuning: Tuning,
  start: number = START_DEFAULT,
  range: number = RANGE_DEFAULT
): number[][] => {
  // Find all notes that fall between start <-> start + range
  const matches = map(tuning.Offsets, (o: number, i: number) => {
    return filter(chord.Pitches, (n) => {
      let pos = calcNotePosition(n, o, start);

      const isWithinRange = pos >= start && pos <= start + range;
      return isWithinRange;
    });
  });

  // Calculate number of combinations from matched notes
  const potentialNotes = map(matches, (m) => m.length);
  const numVariations = reduce(potentialNotes, (acc, next) => acc * next);

  // Calculate variations
  // TODO: improve this?
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
    if (pos - start !== formPositions[i] && formPositions[i] !== null)
      matches = false;
    console.log(pos - start, formPositions[i], matches);
  });

  return matches;
};

const testStyle: React.CSSProperties = {
  position: 'fixed',
  width: 100,
  height: 40,
  top: 10,
  left: 10,
};

const Indicators: React.FunctionComponent<IndicatorsProps> = ({ options }) => {
  const { tuning, numFrets } = options;

  const [current, setCurrent] = useState<number>(0);
  const [variations, setVariations] = useState<number[][]>();

  useEffect(() => {
    // Test Chord
    const chord = new Chord(Note.C(), ChordType.Major);

    const variations: number[][] = [];

    times(8, (n) => {
      variations.push(...calcVariations(chord, tuning, n));
    });

    const filteredVariations: number[][] = [];
    each(ChordForm.All(), (f) => {
      const matches = filter(variations, (v) => matchesChordForm(v, f));
      console.log(matches);
      matches.length && filteredVariations.push(matches[0]);
    });

    // setVariations(variations);
    setVariations(filteredVariations);
  }, []);

  const renderDebug = () => {
    if (!variations) {
      return <></>;
    }

    return (
      <Button
        title="test"
        style={testStyle}
        onClick={() => setCurrent((current + 1) % variations.length)}
      />
    );
  };

  const renderIndicator = (stringIndex: number, fretNum: number) => {
    return (
      <div className={`fret${fretNum === 0 ? ' open' : ''}`} key={fretNum}>
        {variations[current][stringIndex] === fretNum && (
          <div className="indicator"></div>
        )}
      </div>
    );
  };

  return (
    <div className="indicators">
      {renderDebug()}
      {variations &&
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

export default Indicators;
