import { map } from 'lodash';
import * as React from 'react';
import { useAppOptionsContext } from '..';
import { useStyles } from '../hooks';
import { Note } from '../models';
import { FretMarkers, FretNumbers } from './neck';

export const ENABLE_NECK_MARKERS = true;
export const ENABLE_NECK_NUMBERS = true;

const ENABLE_STRINGS = false;

export interface BackdropProps {}

const fretHeight = 100;

// TODO: temp from option switch over
const markers = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0];
// markers: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2], // ukulele

export const Backdrop: React.FunctionComponent<BackdropProps> = ({}) => {
  const { appOptions } = useAppOptionsContext();
  const { instrument, tuning } = appOptions;

  const { styles: styles } = useStyles();

  const renderString = () => {
    return (
      <div className="strings">
        {map(tuning.Offsets, (o: Note, i: number) => {
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
          <div className="shadow" style={styles.shadow}></div>
        </div>
        <div className="shadow-overlay-container">
          <div className="shadow-overlay" style={styles.overlay}></div>
        </div>
        <div className="fretboard-container">
          <div className="fretboard" style={styles.fretboard}></div>
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
              <FretMarkers markers={markers} frets={instrument.NumFrets} />
            </div>
          )}
        </div>
      </>
    );
  }

  return <></>;
};
