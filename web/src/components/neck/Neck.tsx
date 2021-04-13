import { times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StringComponent } from '.';
import { useAppOptionsContext } from '../..';
import { useStyles } from '../../hooks';
import { Scale, TuningNote } from '../../models';
import { FretDisplayMode } from './Fret';

export const ENABLE_NECK_ANIMATION = false;

// const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface NeckProps { }

export type NeckMap = TuningNote[][];

export const Neck: React.FunctionComponent<NeckProps> = () => {

  const { appOptions } = useAppOptionsContext();
  const { neck } = useStyles();

  const { fretDisplayMode, key, tuning, instrument } = appOptions;

  const [scale, setScale] = useState<Scale>(key.Scale);
  const [className, setClassName] = useState<string>();

  useEffect(() => {
    const nextScale = key.Scale;
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
  }, [key]);

  return (
    <div className="neck" style={neck}>
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
