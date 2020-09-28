import { each, filter, isNull, map, reduce, times } from 'lodash';
import * as React from 'react';
import { Chord, ChordType, IOptions, Note, Tuning } from '../models';

export const START_DEFAULT = 0;
export const RANGE_DEFAULT = 5;

interface IndicatorsProps {
  options: IOptions;
}

const calcNotePosition = (note: Note, offset: number): number => {
  return (note.Modified - offset + Note.NUM_NOTES) % Note.NUM_NOTES;
};

const calcVariations = (
  chord: Chord,
  tuning: Tuning,
  start: number = START_DEFAULT,
  range: number = RANGE_DEFAULT
) => {
  const matches = map(tuning.Offsets, (o: number, i: number) => {
    return filter(chord.Pitches, (n) => {
      const pos = calcNotePosition(n, o);
      return pos >= start && pos <= start + range;
    });
  });

  const potentialNotes = map(matches, (m) => m.length);
  const numVariations = reduce(potentialNotes, (acc, next) => acc * next);

  let variations: any = [];
  times(numVariations, (n) => {
    let multiplier = 1;
    const newVariation = map(potentialNotes, (p, i) => {
      const prev = multiplier;
      multiplier *= p;

      const index = Math.floor(n / prev) % p;
      return calcNotePosition(matches[i][index], tuning.Offsets[i]);
    });

    variations.push(newVariation);
  });

  return variations;
};

const Indicators: React.FunctionComponent<IndicatorsProps> = ({ options }) => {
  const { tuning, numFrets } = options;

  const cMajor = new Chord(Note.A(), ChordType.Minor);

  // console.log('ROOT', cMajor.Label);
  console.log('KEY', cMajor.Keys[0].Label);
  // console.log('PITCHES', cMajor.Pitches, NoteUtils.toString(cMajor.Pitches));
  console.log('CHORD', cMajor.Label, cMajor.Abbreviated)

  const variations = calcVariations(cMajor, tuning);

  let show = variations[9];

  console.log('show', show);
  console.log('variations', variations);
  // const show = calcIndicatorsFromChord(cMajor, tuning, 0, 4, true, true);

  return (
    <div className="indicators">
      {map(tuning.Offsets, (o: number, i: number) => {
        return (
          <div className="string" key={i}>
            <div className="fret open">{show[i] === 0 && <div className="indicator"></div>}</div>
            {times(numFrets, (n: number) => {
              return (
                <div className="fret" key={n}>
                  {show[i] === n + 1 && <div className="indicator"></div>}
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
