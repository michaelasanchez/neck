import * as React from 'react';
import { IOptions } from '../models';
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
  };

  const neckWithMarginStyles = {
    height: neckStyles.height + 100 * 2,
  };

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
          <div className="fretboard-markers">
            <FretMarkers markers={markers} />
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
};
