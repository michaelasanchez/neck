import { filter, indexOf, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { AppOptions } from '../shared';

export enum IndicatorsMode {
  Chord,
  // Scale,
}

interface IndicatorsProps {
  appOptions: AppOptions;
  mainRef: React.MutableRefObject<HTMLDivElement>;
}

export const Indicators: React.FunctionComponent<IndicatorsProps> = (props) => {
  const { appOptions, mainRef } = props;

  const { chordVariation: variation, tuning, instrument } = appOptions;

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
  }, [variation]);

  const renderIndicator = (
    fretNum: number,
    show: boolean = false,
    muted: boolean = false,
    // barre: boolean = false,
    // barreStart: boolean = false,
    firstRef?: React.MutableRefObject<HTMLDivElement>
  ) => {
    let props: any = firstRef ? { ref: firstRef } : {};
    return (
      <div
        className={`fret${fretNum === 0 ? ' open' : ''}`}
        key={fretNum}
        {...props}
      >
        {show && (
          <div
            className={`indicator${muted ? ' muted' : ''}`}
            // className={`indicator${muted ? ' muted' : ''}${
            //   barre ? (barreStart ? ' barre start' : ' barre') : ''
            // }`}
          ></div>
        )}
      </div>
    );
  };

  let renderIndicators = false;

  let firstFret: number;

  if (variation != null) {
    renderIndicators = true;
    // barreStart = findIndex(chord.Barre, (p) => p !== null);

    const nonNullPositions = filter(variation.Positions, (p) => p !== null);
    firstFret = indexOf(variation.Positions, Math.min(...nonNullPositions));
  }

  return (
    <div className="indicators">
      {renderIndicators &&
        map(tuning.Offsets, (s: number, i: number) => {
          const position = variation.Positions[i];

          // const barre = chord.Barre[i];
          // const start = i === barreStart;

          const open = position === 0;
          const muted = position === null;

          return (
            <div className="string" key={i}>
              {renderIndicator(
                0,
                open || muted,
                muted,
                // false,
                // false,
                (open || muted) && i == firstFret ? firstIndicatorRef : null
              )}
              {times(instrument.NumFrets, (f) => {
                const fretNum = f + 1;
                // const isBarre = barre == fretNum;
                const show = position === fretNum; // || isBarre;
                return renderIndicator(
                  fretNum,
                  show,
                  false,
                  // isBarre,
                  // start,
                  show && i == firstFret ? firstIndicatorRef : null
                );
              })}
            </div>
          );
        })}
    </div>
  );
};
