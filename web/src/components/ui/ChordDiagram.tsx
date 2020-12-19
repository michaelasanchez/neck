import { filter, map, max, min, times } from 'lodash';
import * as React from 'react';
import { Chord, ChordVariation, Note } from '../../models';
import { NoteUtils } from '../../shared';

export const MIN_NUM_FRETS_DEFAULT = 4;
export const FRET_PADDING_DEFAULT = 1;

export interface ChordDiagramProps {
  chord: Chord;
  chordVariation: ChordVariation;
  setChordVariation: (options: ChordVariation) => void;
  active?: boolean;
  size?: ChordDiagramSize;
}

export enum ChordDiagramSize {
  Small = 'sm',
  Medium = 'md',
  Normal = '',
}

enum BarreClass {
  Start = 'start',
  Segment = '',
  End = 'end',
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord: chord,
  chordVariation: variation,
  setChordVariation: handleClick,
  active,
  size = ChordDiagramSize.Small,
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
          <div className={`symbol dot${root ? ' root' : ''}`}></div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const chordRoots = new Array(variation.Pitches.length);
  const noteLabels = map(variation.Pitches, (p: number, i: number) => {
    const result = filter(chord.Tones, (t: any) => p == t.Pitch);

    if (result.length) {
      var note = new Note(result[0].Base, result[0].Suffix);
      chordRoots[i] = NoteUtils.NotesAreEqual(note, chord.Root);
      return note.Label;
    }

    return null;
  });

  const offsetSpan = React.useRef();
  let offsetWidth = 0;

  const current = offsetSpan.current as HTMLElement;
  if (current) {
    offsetWidth = current.offsetWidth;
  }
  const outlineStyle = {
    width: `calc(100% + ${20 + offsetWidth}px)`,
    left: -10 - offsetWidth,
  };

  const spanStyle = {
    left: -4 - offsetWidth,
  };

  return (
    <div
      className={`diagram ${size}${active ? ' active' : ''}`}
      onClick={() => handleClick(variation)}
    >
      <div className="diagram-outline" style={outlineStyle}></div>
      <div className="diagram-container">
        <span ref={offsetSpan} style={spanStyle}>
          {minPos != 0 && minPos}
        </span>
        {times(variation.Positions.length, (s) => {
          const barreFret = variation.Positions[variation.Barres[0]];

          return (
            <div className="string" key={s}>
              {times(numFrets, (f) => {
                const show = variation.Positions[s] == f + minPos - paddingTop;
                const open = f == 0 && minPos - paddingTop < 1;
                const mute = variation.Positions[s] == null && f === 0;
                const root = chordRoots[s];

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
