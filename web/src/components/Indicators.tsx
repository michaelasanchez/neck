import { filter, indexOf, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Note } from '../models';
import { AppOptions } from '../shared';
import { Indicator } from './ui';

export enum IndicatorsMode {
  Chord,
  Scale,
  Search,
}

interface IndicatorsProps {
  appOptions: AppOptions;
  mainRef: React.MutableRefObject<HTMLDivElement>;
}

export const Indicators: React.FunctionComponent<IndicatorsProps> = (props) => {
  const { appOptions, mainRef } = props;

  const {
    indicatorsMode: mode = IndicatorsMode.Chord,
    chord,
    chordVariation,
    scale,
    scaleVariation,
    tuning,
    instrument,
  } = appOptions;

  const firstIndicatorRef = useRef();

  useEffect(() => {
    if (!!mainRef?.current && !!firstIndicatorRef?.current) {
      const first = firstIndicatorRef.current as HTMLDivElement;

      const main = mainRef.current;

      let scrollPosition = Math.max(0, first.offsetTop - 100);
      scrollPosition = Math.min(
        scrollPosition,
        main.scrollHeight - main.clientHeight
      );

      main.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }, [chordVariation]);

  /* ChordVariation */
  if (mode == IndicatorsMode.Chord && !!chordVariation) {

    console.log(chord, chordVariation);

    const nonNullPositions = filter(
      chordVariation.Positions,
      (p) => p !== null
    );

    let firstFret = indexOf(
      chordVariation.Positions,
      Math.min(...nonNullPositions)
    );

    return (
      <div className="indicators">
        {map(tuning.Offsets, (s: number, i: number) => {
          const position = chordVariation.Positions[i];

          const open = position === 0;
          const muted = position === null;

          const pitch = chordVariation.Pitches[i];
          const note = filter(chord.Tones, n => n.Pitch === pitch)[0];

          return (
            <div className="string" key={i}>
              <Indicator
                open={true}
                show={open || muted}
                muted={muted}
                root={note.Degree === 1}
                degree={note.Degree}
                label={note.Label}
                firstRef={
                  (open || muted) && i == firstFret ? firstIndicatorRef : null
                }
              />
              {times(instrument.NumFrets, (f) => {
                const fretNum = f + 1;
                const show = position === fretNum;
                return (
                  <Indicator
                    key={f}
                    show={show}
                    root={note.Degree === 1}
                    label={note.Label}
                    degree={note.Degree}
                    firstRef={show && i == firstFret ? firstIndicatorRef : null}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  } else if (mode == IndicatorsMode.Scale && !!scaleVariation && scaleVariation.ScaleId == scale.Id) {  // TODO: variation swap bug
    /* ScaleVariation */
    const fretStart = scaleVariation.Offset;
    const fretEnd =
      scaleVariation.Offset + scaleVariation.Positions[0].length - 1;

    let scaleStarted = false;
    let scaleEnded = false;

    interface NoteMap {
      [key: number]: Note;
    }

    let noteMap: NoteMap = {};
    times(scale.Notes.length, n => {
      let current = scale.Notes[n];
      noteMap[current.Degree] = current;
    });

    return (
      <div className="indicators">
        {map(tuning.Offsets, (s: number, i: number) => {
          const positions = scaleVariation.Positions[i];
          const open = scaleVariation.Offset === 0 && positions[0] !== null;

          return (
            <div className="string" key={i}>
              {times(instrument.NumFrets + 1, (f) => {
                let degree: number;
                let label: string;

                let show = false;
                if (f >= fretStart && f <= fretEnd) {
                  degree = positions[f - fretStart];

                  if (degree) {
                    label = noteMap[degree].Label;
                  }

                  show = !!degree;
                }

                if (degree == 1) {
                  if (!scaleStarted) {
                    scaleStarted = true;
                  } else {
                    // TODO: Only accounts for single scale
                    scaleEnded = true;
                  }
                }

                return (
                  <Indicator
                    open={f === 0}
                    show={show}
                    key={f}
                    degree={scaleEnded && degree === 1 ? degree + 7 : degree}
                    root={degree === 1}
                    label={label}
                    fretClassName={
                      (!scaleStarted || scaleEnded) && degree != 1
                        ? 'faded'
                        : null
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};
