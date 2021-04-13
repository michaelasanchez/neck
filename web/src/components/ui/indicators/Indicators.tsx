import {
  filter,
  findIndex,
  first,
  indexOf,
  lastIndexOf,
  map,
  times,
} from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FretIndicator, SearchIndicators } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { ScaleDegree } from '../../../enums';
import { useStyles } from '../../../hooks';
import { FretMap, Note } from '../../../models';

const DISPLAY_MULTIPLE_SCALES = false;

export enum IndicatorsMode {
  Chord,
  Scale,
  Search,
}

interface IndicatorsProps {
  mainRef: React.MutableRefObject<HTMLDivElement>;
}

export const Indicators: React.FunctionComponent<IndicatorsProps> = (props) => {
  const { chordVariation, scaleVariation } = useIndicatorsContext();
  const { appOptions } = useAppOptionsContext();
  const {
    key,
    indicatorsMode: mode,
    chord,
    scale,
    tuning,
    instrument,
    autoScroll,
  } = appOptions;

  const { indicators } = useStyles();
  const { mainRef } = props;
  const topRef = useRef<HTMLDivElement>();
  const bottomRef = useRef<HTMLDivElement>();

  // Browser scroll position
  useEffect(() => {
    if (!!mainRef?.current && !!topRef?.current) {
      const first = topRef.current;
      const last = !!bottomRef?.current ? bottomRef.current : first;

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

      if (scrollPosition !== undefined && !!autoScroll)
        main.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }, [chordVariation, scaleVariation, mode, autoScroll]);

  const renderChordIndicators = () => {
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
      <>
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
                fretRef={(open || muted) && i == firstFretIndex ? topRef : null}
              />
              {times(instrument.NumFrets, (f) => {
                const fretNum = f + 1;
                const show = position === fretNum;
                const ref =
                  show &&
                  (i == firstFretIndex
                    ? topRef
                    : i == lastFretIndex
                    ? bottomRef
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
      </>
    );
  };

  const renderScaleIndicators = () => {
    const fretStart = scaleVariation.Offset;
    const fretEnd =
      scaleVariation.Offset + scaleVariation.Positions[0].length - 1;

    let scaleStarted = false;
    let scaleEnded = false;

    interface NoteMap {
      [key: number]: Note;
    }

    let degreeLookup: NoteMap = {};
    times(scale.Notes.length, (n) => {
      let current = scale.Notes[n];
      degreeLookup[current.Degree] = current;
    });

    let tonicLookup = map(
      scaleVariation.Positions,
      (s) => indexOf(s, ScaleDegree.Tonic) >= 0
    );
    const firstTonicString = indexOf(tonicLookup, true);
    const lastTonicString = DISPLAY_MULTIPLE_SCALES
      ? lastIndexOf(tonicLookup, true)
      : indexOf(tonicLookup, true, firstTonicString + 1)
    console.log(firstTonicString, lastTonicString);
    

    return (
      <>
        {map(tuning.Offsets, (o: Note, i: number) => {
          const positions = scaleVariation.Positions[i];

          return (
            <div className="string" key={i}>
              {times(instrument.NumFrets + 1, (f) => {
                let degree: number;
                let label: string;

                let show = false;
                if (f >= fretStart && f <= fretEnd) {
                  degree = positions[f - fretStart];

                  if (degree) {
                    label = degreeLookup[degree].Label;
                  }

                  show = !!degree;
                }

                if (degree == 1) {
                  if (!scaleStarted && i == firstTonicString) {
                    scaleStarted = true;
                  } else if (!scaleEnded && i == lastTonicString) {
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
                        ? topRef
                        : i === tuning.Offsets.length - 1 && f === fretEnd
                        ? bottomRef
                        : null
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  const renderIndicators = () => {
    if (
      mode == IndicatorsMode.Chord &&
      !!chordVariation &&
      chordVariation.ChordId === chord.Id &&
      chordVariation.TuningId === tuning?.Id
    ) {
      return renderChordIndicators();
    } else if (
      mode == IndicatorsMode.Scale &&
      !!scaleVariation &&
      scaleVariation.ScaleId === scale.Id &&
      scaleVariation.TuningId === tuning?.Id
    ) {
      return renderScaleIndicators();
    } else if (mode == IndicatorsMode.Search) {
      return <SearchIndicators />;
    } else {
      return <></>;
    }
  };

  return (
    <div
      className={`indicators${mode === IndicatorsMode.Search ? ' search' : ''}`}
      style={indicators}
    >
      {renderIndicators()}
    </div>
  );
};
