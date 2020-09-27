import { each, filter, map, times } from 'lodash';
import * as React from 'react';

import {
  Chord,
  ChordModifer,
  ChordType,
  IOptions,
  Key,
  Note,
  Tuning,
} from '../models';

interface IndicatorsProps {
  options: IOptions;
}

// TODO: remove after debugging
export const notesToString = (notes: Note[]) => map(notes, (n) => n.Label);

const calcNotePosition = (note: Note, offset: number): number => {
  return (note.Modified - offset + Note.NUM_NOTES) % Note.NUM_NOTES;
};

const calcIndicatorsFromChord = (
  chord: Chord,
  tuning: Tuning,
  start: number = 0,
  range: number = 4
): (number | null)[] => {
  let indicators: (number | null)[] = [null, null, null, null, null, null];

  each(tuning.Offsets, (o: number, i: number) => {
    // console.log('OFFSET', o);

    // Notes on start or first four frets
    const matches = filter(chord.Pitches, (n) => {
      const pos = calcNotePosition(n, o);
      // console.log('POS', `${n.Label} - start: ${start} range: ${range} pos: ${pos} test: ${pos >= start && pos <= start + range}`);
      return pos >= start && pos <= start + range;
    });

    let setIndicator,
      setAll = false;

    // single match within range
    if (matches.length === 1) {
      setIndicator = matches[0];

      // no matches, check range + 1
    } else if (matches.length === 0) {
      console.log('no matches');
      setAll = true;
    } else {
      const matchesStart = filter(
        matches,
        (n) => calcNotePosition(n, o) === start
      );
      if (matchesStart.length) {
        console.log(
          matchesStart[0],
          calcNotePosition(matchesStart[0], o),
          start
        );
        setIndicator = matchesStart[0];
      } else {
        // console.log('other matches', matches, notesToString(matches));

        // setIndicator = matches[0];
        setIndicator = matches[matches.length - 1];
      }
    }

    if (setAll) {
      console.log('- TRY AGAIN ------------------------------------------');
      return calcIndicatorsFromChord(chord, tuning, start + 1, range);
    } else if (setIndicator) {
      indicators[i] = calcNotePosition(setIndicator, o);
    }
  });

  return indicators;
};

const Indicators: React.FunctionComponent<IndicatorsProps> = ({ options }) => {
  const { tuning, numFrets } = options;

  const cMajor = new Chord(Note.G(), ChordType.Minor);

  const show = calcIndicatorsFromChord(cMajor, tuning);

  return (
    <div className="indicators">
      {map(tuning.Offsets, (o: number, i: number) => {
        return (
          <div className="string" key={i}>
            <div className="fret open">
              {show[i] === 0 && <div className="indicator"></div>}
            </div>
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
