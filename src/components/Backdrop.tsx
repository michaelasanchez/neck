import * as React from 'react';
import { IOptions } from '../models';
import { styles } from '../shared';
import { FretMarkers, FretNumbers } from './neck';

export const ENABLE_NECK_MARKERS = true;
export const ENABLE_NECK_NUMBERS = true;

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
  }

  return (
    <>
      <div className="layer">
        <div className="shadow" style={neckStyles}></div>
      </div>
      <div className="layer">
        <div className="shadow-overlay" style={neckWithMarginStyles}></div>
      </div>
      <div className="layer">
        <div className="fretboard" style={neckWithMarginStyles}></div>
      </div>
      <div className="layer">
        {ENABLE_NECK_NUMBERS && <FretNumbers frets={numFrets} />}
      </div>
      <div className="layer">
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
