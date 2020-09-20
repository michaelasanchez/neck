import { map } from 'lodash';
import * as React from 'react';
import { IOptions } from '../models';
import { styles } from '../shared';
import { FretMarkers, FretNumbers } from './neck';

export const ENABLE_NECK_MARKERS = true;
export const ENABLE_NECK_NUMBERS = true;

const ENABLE_STRINGS = false;

export interface BackdropProps {
  options?: IOptions;
}

export const Backdrop: React.FunctionComponent<BackdropProps> = ({
  options,
}) => {
  const { numFrets, markers } = options;

  const neckStyles = {
    height: (numFrets + 1) * 80,
    maxWidth: styles.neck.maxWidth,
  };

  const neckWithMarginStyles = {
    height: neckStyles.height + 100 * 2,
    maxWidth: styles.neck.maxWidth,
  };

  const fretMarkers = {
    maxWidth: styles.neck.maxWidth,
  };

  const renderString = () => {
    return (
      <div className="strings">
        {map(options.tuning.Offsets, (o: number, i: number) => {
          return (
            <div
              className="string"
              key={i}
              style={{ height: numFrets * 80 }}
            ></div>
          );
        })}
      </div>
    );
  };

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
        {ENABLE_NECK_NUMBERS && <FretNumbers frets={numFrets} />}
      </div>
      <div className="fretboard-markers-container">
        {ENABLE_NECK_MARKERS && (
          <div className="fretboard-markers" style={fretMarkers}>
            <FretMarkers markers={markers} />
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
};
