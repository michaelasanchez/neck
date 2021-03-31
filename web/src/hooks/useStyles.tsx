import { reduce, times } from 'lodash';
import { CSSProperties, useEffect, useState } from 'react';
import { useAppOptionsContext } from '..';

const mobileHMargin = 60; // Used for fret number width
const mobileVMargin = 100;

const fretHeight = 100;
const fretWidth = 66;

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

// const mobile = window && window.matchMedia
//   ? window.matchMedia("(max-width: 768px)")
//   : {} as MediaQueryList;
// function getNumbersWidth(x: MediaQueryList) {
//   return x.matches ? FRET_NUMBERS_WIDTH_MOBILE : FRET_NUMBERS_WIDTH_DESKTOP;
// }

export const useStyles = () => {
  const { appOptions } = useAppOptionsContext();
  const { instrument } = appOptions;

  const fretHeights = times(instrument.NumFrets, (f) => fretHeight - f);

  const neckHeight =
    fretHeight +
    reduce(
      fretHeights,
      (acc: number, cur: number, i: number) =>
        acc + (i <= instrument?.NumFrets ? cur : 0),
      0
    );

  const neckWidth = instrument.NumStrings * fretWidth;
  const neckMaxWidth = `calc(100% - ${mobileHMargin * 2}px)`;

  useEffect(() => {
    setStyles(calcStyles());
  }, [appOptions]);

  const calcStyles = () => {
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
        margin: `0 ${mobileHMargin}px`,
        width: neckWidth,
        maxWidth: neckMaxWidth,
      },
      fretNumbers: {
        maxWidth: neckWidth + mobileHMargin * 2,
      },
      fretNumberGroup: {
        width: mobileHMargin,
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

  const [styles, setStyles] = useState<IStyles>(calcStyles());

  return { styles };
};
