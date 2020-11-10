import { each, filter, findIndex, map, reduce, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { Chord, ChordModifier, ChordVariation, Note, Scale, Tuning } from '../models';
import { IAppOptions } from '../shared';
import { ChordUtils, VARIATION_SPAN_DEFAULT } from '../shared/chord.utils';

export const FILTER_BY_CHORD_FORM = true;

export enum IndicatorsMode {
  Chord,
  // Scale,
}

export interface IndicatorsDisplayOptions {
  mode: IndicatorsMode;
  chord?: ChordVariation;
  // scale?: Scale;
}

interface IndicatorsProps {
  appOptions: IAppOptions;
  displayOptions: IndicatorsDisplayOptions;
}

export const Indicators: React.FunctionComponent<IndicatorsProps> = ({
  appOptions,
  displayOptions,
}) => {
  const { tuning, numFrets } = appOptions;
  const { mode } = displayOptions;

  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0);

  const renderIndicator = (
    fretNum: number,
    show: boolean = false,
    muted: boolean = false,
    barre: boolean = false,
    start: boolean = false
  ) => {
    return (
      <div className={`fret${fretNum === 0 ? ' open' : ''}`} key={fretNum}>
        {show && (
          <div
            className={`indicator${muted ? ' muted' : ''}${
              barre ? (start ? ' barre start' : ' barre') : ''
            }`}
          ></div>
        )}
      </div>
    );
  };

  let renderIndicators = false;

  let barreStart: number;
  if (displayOptions.chord != null) {
    renderIndicators = true;
    barreStart = findIndex(displayOptions.chord.Barre, (p) => p !== null);
  }

  return (
    <div className="indicators">
      {renderIndicators &&
        map(tuning.Offsets, (s: number, i: number) => {
          const position = displayOptions.chord.Positions[i];

          const barre = displayOptions.chord.Barre[i];
          const start = i === barreStart;

          const open = position === 0;
          const muted = position === null;

          return (
            <div className="string" key={i}>
              {renderIndicator(0, open || muted, muted)}
              {times(numFrets, (f) => {
                const fretNum = f + 1;
                const showPosition = position === fretNum;
                const showBarre = barre === fretNum;
                return renderIndicator(
                  fretNum,
                  showPosition || showBarre,
                  false,
                  showBarre,
                  start
                );
              })}
            </div>
          );
        })}
    </div>
  );
};
