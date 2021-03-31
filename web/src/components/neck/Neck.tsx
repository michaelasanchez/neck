import { times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StringComponent } from '.';
import { useAppOptionsContext } from '../..';
import { useStyles } from '../../hooks';
import { Key, Mode, Scale } from '../../models';
import { FretDisplayMode } from './Fret';

export const ENABLE_NECK_ANIMATION = false;

// const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface NeckProps {}

const getScale = (key: Key, mode: Mode) => new Scale(key.Tonic, mode);

export const Neck: React.FunctionComponent<NeckProps> = () => {
  // TODO: static
  let fretDisplayMode = FretDisplayMode.Note;

  const { appOptions } = useAppOptionsContext();
  const { styles } = useStyles();

  const { key, tuning, mode, instrument } = appOptions;

  const [scale, setScale] = useState<Scale>(getScale(key, mode));
  const [className, setClassName] = useState<string>();

  useEffect(() => {
    const nextScale = getScale(key, mode);
    setScale(nextScale);

    const root = scale?.Tonic;
    const nextRoot = nextScale?.Tonic;

    // Fret Animation
    if (ENABLE_NECK_ANIMATION) {
      const diff = nextRoot?.Pitch - root?.Pitch;

      if ((diff < 0 && diff < -6) || (diff > 0 && diff < 6)) {
        setClassName('down');
      } else {
        setClassName('up');
      }
    }
  }, [key, mode]);

  return (
    <div className="neck" style={styles.neck}>
      <div className={`neck-strings ${!!className ? className : ''}`}>
        {tuning &&
          times(instrument.NumStrings, (i) => (
            <StringComponent
              key={i}
              fretmode={fretDisplayMode}
              frets={instrument.NumFrets}
              offset={i <= tuning.Offsets.length ? tuning.Offsets[i] : null}
              scale={scale}
            />
          ))}
      </div>
    </div>
  );
};
