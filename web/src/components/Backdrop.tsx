import { map } from 'lodash';
import * as React from 'react';

import { AppOptions, styles } from '../shared';
import { FretMarkers, FretNumbers } from './neck';

export const ENABLE_NECK_MARKERS = true;
export const ENABLE_NECK_NUMBERS = true;

const ENABLE_STRINGS = false;

export interface BackdropProps {
  options?: AppOptions;
}

const fretHeight = 100;

// TODO: temp from option switch over
const markers = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0];
// markers: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2], // ukulele

export const Backdrop: React.FunctionComponent<BackdropProps> = ({
  options,
}) => {
  const { instrument, tuning } = options;

  const neckStyles = {
    height: (instrument?.NumFrets + 1) * fretHeight || 0,
    maxWidth: styles.neck.maxWidth,
  };

  const neckWithMarginStyles = {
    height: neckStyles.height + 100 * 2,
    maxWidth: styles.neck.maxWidth,
  };

  const renderString = () => {
    return (
      <div className="strings">
        {map(tuning.Offsets, (o: number, i: number) => {
          return (
            <div
              className="string"
              key={i}
              style={{ height: instrument.NumFrets * fretHeight }}
            ></div>
          );
        })}
      </div>
    );
  };

  if (instrument) {
    return (
      <>
        <div className="shadow-container">
          <div className="shadow" style={neckStyles}></div>
        </div>
        <div className="shadow-overlay-container">
          <div className="shadow-overlay" style={neckWithMarginStyles}></div>
        </div>
        <div className="fretboard-container">
          <div className="fretboard" style={neckWithMarginStyles}></div>
        </div>
        {ENABLE_STRINGS && (
          <div className="strings-container">{renderString()}</div>
        )}
        <div className="fretboard-numbers-container">
          {ENABLE_NECK_NUMBERS && <FretNumbers frets={instrument.NumFrets} />}
        </div>
        <div className="fretboard-markers-container">
          {ENABLE_NECK_MARKERS && (
            <div className="fretboard-markers" style={styles.fretMarkers}>
              <FretMarkers markers={markers} />
            </div>
          )}
        </div>
      </>
    );
  }

  return <></>;
};
