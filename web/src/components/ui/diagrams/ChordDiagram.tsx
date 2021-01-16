import { filter, map, max, min, times } from 'lodash';
import * as React from 'react';

import { DiagramSize, FRET_PADDING_SIZE } from '.';
import { Chord, ChordVariation, Note, NoteValue } from '../../../models';
import { NoteUtils } from '../../../shared';
import { Diagram, MIN_NUM_FRETS } from './Diagram';

export interface ChordDiagramProps {
  chord: Chord;
  chordVariation: ChordVariation;
  setChordVariation: (options: ChordVariation) => void;
  active?: boolean;
  highlighted?: NoteValue[];
  size?: DiagramSize;
}
enum BarreClass {
  Start = 'start',
  Segment = '',
  End = 'end',
}

const calcMinMax = (variation: ChordVariation): { min: number, max: number } => {
  return {
    min: min(variation.Positions),
    max: max(variation.Positions),
  }
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord: chord,
  chordVariation: variation,
  setChordVariation: handleClick,
  active,
  highlighted: highlightedNoteValues = [],
  size = DiagramSize.Small,
}) => {
  const { min: minPos, max: maxPos } = calcMinMax(variation);
  const paddingTop = (minPos == 0 ? 0 : 1) * FRET_PADDING_SIZE;
  const paddingBottom = 1 * FRET_PADDING_SIZE;
  const paddingTotal = paddingTop + paddingBottom;

  // 1 is inclusive
  const numFrets = max([
    maxPos - minPos + 1 + FRET_PADDING_SIZE * paddingTotal,
    MIN_NUM_FRETS,
  ]);

  const renderFretSymbols = (
    show: boolean,
    highlight: boolean,
    root: boolean,
    open: boolean,
    mute: boolean,
    barreClass?: BarreClass
  ) => {
    return (
      <>
        {!open && <div className="symbol string"></div>}
        {mute && <div className="symbol mute"></div>}
        {barreClass !== null && (
          <div className={`symbol barre ${barreClass}`}></div>
        )}
        {show ? (
          <div
            className={`symbol dot${root ? ' root' : ''}${
              highlight ? ' highlight' : ''
            }`}
          ></div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const chordRoots = new Array(variation.Pitches.length);
  const chordHighlighted = map(variation.Pitches, (p) => false);
  const noteLabels = map(variation.Pitches, (p: number, i: number) => {
    const result = filter(chord.Tones, (t: any) => p == t.Pitch);

    if (result.length) {
      var note = new Note(result[0].Base, result[0].Suffix);

      chordRoots[i] = NoteUtils.NotesAreEqual(note, chord.Root);
      chordHighlighted[i] =
        filter(highlightedNoteValues, (v) => v == note.Base).length > 0;

      return note.Label;
    }

    return null;
  });

  const diagramBody = (
    <>
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
                  {renderFretSymbols(
                    show,
                    chordHighlighted[s],
                    root,
                    open,
                    mute,
                    barre
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );

  const diagramLabel = (
    <>
      {map(noteLabels, (p: string, i: number) => (
        <span key={i}>{p}</span>
      ))}
    </>
  );

  return (
    <Diagram
      calcMinMax={() => calcMinMax(variation)}
      handleClick={() => handleClick(variation)}
      active={active}
      className="chord"
      size={size}
      diagramBody={diagramBody}
      diagramLabel={diagramLabel}
    />
  );
};
