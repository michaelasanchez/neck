const mobile = window && window.matchMedia
  ? window.matchMedia("(max-width: 768px)")
  : {} as MediaQueryList;

const NECK_WIDTH = 400;

const FRET_NUMBERS_WIDTH_DESKTOP = 60;
const FRET_NUMBERS_WIDTH_MOBILE = 40;

function getNumbersWidth(x: MediaQueryList) {
  return x.matches ? FRET_NUMBERS_WIDTH_MOBILE : FRET_NUMBERS_WIDTH_DESKTOP;
}

const FRET_NUMBERS_WIDTH = getNumbersWidth(mobile);

export const styles = {
  neck: {
    width: NECK_WIDTH,
    margin: `0 ${FRET_NUMBERS_WIDTH}px`,
    maxWidth: `calc(100% - ${FRET_NUMBERS_WIDTH * 2}px)`,
  },
  fretNumbers: {
    maxWidth: NECK_WIDTH + FRET_NUMBERS_WIDTH * 2,
    width: '100%'
  },
  fretNumberGroup: {
    width: FRET_NUMBERS_WIDTH,
  },
}