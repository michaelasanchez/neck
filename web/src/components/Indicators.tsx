import { filter, indexOf, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { AppOptions } from '../shared';
import { Indicator } from './ui';

export enum IndicatorsMode {
  Chord,
  Scale,
}

interface IndicatorsProps {
  appOptions: AppOptions;
  mainRef: React.MutableRefObject<HTMLDivElement>;
  mode?: IndicatorsMode;
}

export const Indicators: React.FunctionComponent<IndicatorsProps> = (props) => {
  const { appOptions, mainRef, mode = IndicatorsMode.Scale } = props;

  const {
    chordVariation,
    scaleVariation,
    scale,
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

          return (
            <div className="string" key={i}>
              <Indicator
                fretNum={0}
                show={open || muted}
                muted={muted}
                firstRef={
                  (open || muted) && i == firstFret ? firstIndicatorRef : null
                }
              />
              {times(instrument.NumFrets, (f) => {
                const fretNum = f + 1;
                const show = position === fretNum;
                return (
                  <Indicator
                    fretNum={fretNum}
                    show={show}
                    firstRef={show && i == firstFret ? firstIndicatorRef : null}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  } else if (mode == IndicatorsMode.Scale && !!scaleVariation) {
    /* ScaleVariation */
    const fretStart = scaleVariation.Offset;
    const fretEnd =
      scaleVariation.Offset + scaleVariation.Positions[0].length - 1;

    let scaleStarted = false;
    let scaleEnded = false;

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
                    label = scale.Notes[degree - 1].Label;
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
                    fretNum={f}
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
