const NECK_WIDTH = 400;
const FRET_NUMBERS_WIDTH = 40;

export const styles = {
  neck: {
    width: 400,
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