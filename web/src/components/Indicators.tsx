import { filter, indexOf, lastIndexOf, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useAppOptionsContext } from '..';
import { Note } from '../models';
import { FretIndicator } from './ui';

export enum IndicatorsMode {
  Chord,
  Scale,
  Search,
}

interface IndicatorsProps {
  mainRef: React.MutableRefObject<HTMLDivElement>;
}

export const Indicators: React.FunctionComponent<IndicatorsProps> = (props) => {
  const { appOptions } = useAppOptionsContext();

  const { mainRef } = props;

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
  const lastIndicatorRef = useRef();

  useEffect(() => {
    if (!!mainRef?.current && !!firstIndicatorRef?.current) {
      const first = firstIndicatorRef.current as HTMLDivElement;
      const last = lastIndicatorRef.current as HTMLDivElement;

      const main = mainRef.current;

      const scrollPadding = 100;

      const top = first.offsetTop - scrollPadding;
      const bottom = last.offsetTop + last.offsetHeight + scrollPadding;

      let scrollPosition;
      if (top < main.scrollTop) {
        scrollPosition = top;
      } else if (bottom > main.scrollTop + main.offsetHeight) {
        scrollPosition = bottom - main.offsetHeight;
      }

      if (scrollPosition !== undefined)
        main.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }, [chordVariation, scaleVariation, mode]);

  /* ChordVariation */
  if (
    mode == IndicatorsMode.Chord &&
    !!chordVariation &&
    chordVariation.ChordId === chord.Id &&
    chordVariation.TuningId === tuning?.Id
  ) {
    const positions = chordVariation.Formation.Positions;
    const barres = chordVariation.Formation.Barres;

    const nonNullPositions = filter(positions, (p) => p !== null);

    let firstFretIndex = indexOf(positions, Math.min(...nonNullPositions));
    let lastFretIndex = indexOf(positions, Math.max(...nonNullPositions));

    // TODO: supports single barre only
    let barre: number[] = null,
      barreFret: number;
    if (barres?.length) {
      barreFret = positions[barres[0]];
      const firstBarreIndex = indexOf(positions, barreFret);
      const lastBarreIndex = lastIndexOf(positions, barreFret);
      barre = [firstBarreIndex, lastBarreIndex];
    }

    return (
      <div className="indicators">
        {map(tuning.Offsets, (o: Note, i: number) => {
          const position = positions[i];

          const open = position === 0;
          const muted = position === null;

          const pitch = chordVariation.Pitches[i];
          const note = filter(chord.Tones, (n) => n.Pitch === pitch)[0];

          return (
            <div className="string" key={i}>
              <FretIndicator
                open={true}
                show={open || muted}
                muted={muted}
                root={note?.Degree === 1}
                degree={note?.Degree}
                label={note?.Label}
                fretRef={
                  (open || muted) && i == firstFretIndex
                    ? firstIndicatorRef
                    : null
                }
              />
              {times(instrument.NumFrets, (f) => {
                const fretNum = f + 1;
                const show = position === fretNum;
                const ref =
                  show &&
                  (i == firstFretIndex
                    ? firstIndicatorRef
                    : i == lastFretIndex
                    ? lastIndicatorRef
                    : null);

                return (
                  <FretIndicator
                    key={f}
                    show={show}
                    root={note?.Degree === 1}
                    label={note?.Label}
                    degree={note?.Degree}
                    fretRef={ref}
                    barre={
                      barre &&
                      f + 1 === barreFret &&
                      i >= barre[0] &&
                      i <= barre[1]
                    }
                    barreClass={
                      barre &&
                      f + 1 === barreFret &&
                      (i === barre[0] ? 'start' : i === barre[1] ? 'end' : null)
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );

    /* ScaleVariation */
  } else if (
    mode == IndicatorsMode.Scale &&
    !!scaleVariation &&
    scaleVariation.ScaleId === scale.Id &&
    scaleVariation.TuningId === tuning?.Id
  ) {
    const fretStart = scaleVariation.Offset;
    const fretEnd =
      scaleVariation.Offset + scaleVariation.Positions[0].length - 1;

    let scaleStarted = false;
    let scaleEnded = false;

    interface NoteMap {
      [key: number]: Note;
    }

    let noteMap: NoteMap = {};
    times(scale.Notes.length, (n) => {
      let current = scale.Notes[n];
      noteMap[current.Degree] = current;
    });

    return (
      <div className="indicators">
        {map(tuning.Offsets, (o: Note, i: number) => {
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
                  <FretIndicator
                    open={f === 0}
                    show={show}
                    key={f}
                    degree={scaleEnded && degree === 1 ? degree + 7 : degree}
                    root={degree === 1}
                    label={label}
                    fretClass={
                      (!scaleStarted || scaleEnded) && degree != 1
                        ? 'faded'
                        : null
                    }
                    fretRef={
                      i === 0 && f === fretStart
                        ? firstIndicatorRef
                        : i === tuning.Offsets.length - 1 && f === fretEnd
                        ? lastIndicatorRef
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
