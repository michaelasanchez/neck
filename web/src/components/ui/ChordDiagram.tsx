import { filter, map, max, min, times } from 'lodash';
import * as React from 'react';
import { ChordVariation, Note } from '../../models';

export const MIN_NUM_FRETS_DEFAULT = 4;
export const FRET_PADDING_DEFAULT = 1;

export interface ChordDiagramProps {
  chordVariation: ChordVariation;
  setChordVariation: (options: ChordVariation) => void;
}

enum BarreClass {
  Start = 'start',
  Segment = '',
  End = 'end',
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chordVariation: variation,
  setChordVariation: handleClick,
}) => {
  const minPos = min(variation.Positions);
  const maxPos = max(variation.Positions);
  const paddingTop = (minPos == 0 ? 0 : 1) * FRET_PADDING_DEFAULT;
  const paddingBottom = 1 * FRET_PADDING_DEFAULT;
  const paddingTotal = paddingTop + paddingBottom;
  // 1 is inclusive
  const numFrets = max([
    maxPos - minPos + 1 + FRET_PADDING_DEFAULT * paddingTotal,
    MIN_NUM_FRETS_DEFAULT,
  ]);

  const renderFretSymbols = (
    show: boolean,
    root: boolean,
    open: boolean,
    mute: boolean,
    barreClass?: BarreClass
  ) => {
    return (
      <>
        {!open && <div className="symbol string"></div>}
        {mute && <div className="symbol mute"></div>}
        {barreClass !== null ? (
          <div className={`symbol barre ${barreClass}`}></div>
        ) : show ? (
          <div className="symbol dot"></div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const chordRoots = new Array(variation.Pitches.length);
  const noteLabels = map(variation.Pitches, (p: number, i: number) => {
    const result = filter(variation.Chord.Tones, (t: any) => p == t.Pitch);

    if (result.length) {
      var note = new Note(result[0].Base, result[0].Suffix);
      return note.Label;
    }

    return null;
  });

  return (
    <div className="diagram sm" onClick={() => handleClick(variation)}>
      <div className="diagram-container">
        <span>{minPos != 0 && minPos}</span>

        {times(variation.Positions.length, (s) => {
          const barreFret = variation.Positions[variation.Barres[0]];

          return (
            <div className="string" key={s}>
              {times(numFrets, (f) => {
                const show = variation.Positions[s] == f + minPos - paddingTop;
                const open = f == 0 && minPos - paddingTop < 1;
                const mute = variation.Positions[s] == null && f === 0;
                const root = false;

                // TODO: Supports single barre for now
                let barre: BarreClass;
                if (
                  s >= variation.Barres[0] &&
                  barreFret == f + minPos - paddingTop
                ) {
                  if (s == variation.Barres[0]) {
                    barre = BarreClass.Start;
                  } else if (s == variation.Positions.length - 1) {
                    barre = BarreClass.End;
                  } else {
                    barre = BarreClass.Segment;
                  }
                } else {
                  // TODO: renderFretSymbols depends on this line
                  barre = null;
                }

                return (
                  <div className={`fret${open ? ' open' : ''}`} key={f}>
                    {renderFretSymbols(show, root, open, mute, barre)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="label-container">
        {map(noteLabels, (p: string, i: number) => (
          <span key={i}>{p}</span>
        ))}
      </div>
    </div>
  );
};
