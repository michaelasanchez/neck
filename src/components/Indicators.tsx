import {
  each,
  filter,
  filter,
  indexOf,
  isEqual,
  isNull,
  map,
  min,
  reduce,
  times,
  uniqBy,
} from 'lodash';
import * as React from 'react';
import { useState } from 'react';
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

const calcNotePosition = (
  note: Note,
  offset: number,
  start: number = 0
): number => {
  let pos = (note.Modified - offset + Note.NUM_NOTES) % Note.NUM_NOTES;
  while (pos < start) pos += Note.NUM_NOTES;
  return pos;
};

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

  // Calculate each variation
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
  return isEqual(
    mapTypeToPositions(form),
    map(variation, (o) => o - start)
  );
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

  // Test Chord
  const chord = new Chord(Note.C(), ChordType.Major);

  const brickbybrick = [];
  const variations = calcVariations(chord, tuning);

  times(9, (n) => {
    variations.push(...calcVariations(chord, tuning, n));
  });

  // const finalVariations = uniqBy(variations, '')
  // console.log(variations, finalVariations)

  const final: number[][] = [];
  each(ChordForm.All(), (f) => {
    const matches = filter(variations, (v) => matchesChordForm(v, f));
    matches.length && final.push(matches[0]);
  });

  const [current, setCurrent] = useState<number>(0);
  let show = variations[current];

  return (
    <div className="indicators">
      <Button
        title="test"
        style={testStyle}
        onClick={() => setCurrent((current + 1) % variations.length)}
      />
      {map(tuning.Offsets, (s: number, i: number) => {
        return (
          <div className="string" key={i}>
            <div className="fret open">
              {show[i] === 0 && <div className="indicator"></div>}
            </div>
            {times(numFrets, (f: number) => {
              return (
                <div className="fret" key={f}>
                  {show[i] === f + 1 && <div className="indicator"></div>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Indicators;
