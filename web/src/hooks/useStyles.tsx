import { reduce, times } from 'lodash';
import { CSSProperties, useEffect, useState } from 'react';
import { useAppOptionsContext } from '..';
import { Instrument } from '../models';

const mobileHMargin = 40; // Used for fret number width
const mobileVMargin = 100;

const fretHeight = 100;
const fretWidth = 66;

const fretNumberWidth = 60;

export interface IStyles {
  neck: CSSProperties;
  indicators: CSSProperties;

  frets: number[];
  fretMarkers: CSSProperties;
  fretNumberGroup: CSSProperties;
  fretNumbers: CSSProperties;

  fretboard: CSSProperties;
  overlay: CSSProperties;
  shadow: CSSProperties;
}

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const calcStyles = (instrument: Instrument, mobile: boolean) => {
  const fretHeights = times(instrument.NumFrets, (f) => fretHeight - (f * 1.1));

  const neckHeight =
    fretHeight +
    reduce(
      fretHeights,
      (acc: number, cur: number, i: number) =>
        acc + (i <= instrument?.NumFrets ? cur : 0),
      0
    );

  const neckHMargin = mobile ? mobileHMargin : fretNumberWidth;

  const neckWidth = instrument.NumStrings * fretWidth;
  const neckMaxWidth = `calc(100% - ${neckHMargin * 2}px)`;

  return {
    neck: {
      width: neckWidth,
      maxWidth: neckMaxWidth,
    },
    indicators: {
      width: neckWidth,
      maxWidth: neckMaxWidth,
    },
    frets: fretHeights,
    fretMarkers: {
      margin: `0 ${neckHMargin}px`,
      width: neckWidth,
      maxWidth: neckMaxWidth,
    },
    fretNumbers: {
      maxWidth: neckWidth + neckHMargin * 2,
    },
    fretNumberGroup: {
      width: neckHMargin,
    },
    shadow: {
      height: neckHeight,
      width: neckWidth,
      maxWidth: neckMaxWidth,
    },
    overlay: {
      height: neckHeight + mobileVMargin * 2,
      width: neckWidth,
      maxWidth: neckMaxWidth,
    },
    fretboard: {
      height: neckHeight + mobileVMargin * 2,
      width: neckWidth,
      maxWidth: neckMaxWidth,
    },
  };
};

const MOBILE_WIDTH = 576;

const getMobile = () => getWidth() <= MOBILE_WIDTH;

export const useStyles = () => {
  const { appOptions } = useAppOptionsContext();
  const { instrument } = appOptions;

  const [mobile, setMobile] = useState<boolean>(getMobile());
  const [styles, setStyles] = useState<IStyles>(
    calcStyles(instrument, getMobile())
  );

  useEffect(() => {
    const resizeListener = () => {
      setMobile(getMobile());
    };

    window.addEventListener('resize', resizeListener);

    // clean up
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    setStyles(calcStyles(instrument, mobile));
  }, [instrument, mobile]);

  return { ...styles, mobile };
};
