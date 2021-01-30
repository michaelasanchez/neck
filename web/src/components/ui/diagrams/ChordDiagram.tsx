import { filter, map, max, min, times } from 'lodash';
import * as React from 'react';

import { DiagramSize, FRET_PADDING_SIZE } from '.';
import { Chord, ChordVariation, Note, NoteValue } from '../../../models';
import { NoteUtils } from '../../../shared';
import { Diagram, DiagramSpan, DiagramSymbol, MIN_NUM_FRETS } from './Diagram';

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

const calcSpan = (variation: ChordVariation): DiagramSpan => {
  return {
    min: min(variation.Positions),
    max: max(variation.Positions) + 1,
  };
};

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord: chord,
  chordVariation: variation,
  setChordVariation: handleClick,
  active,
  highlighted: highlightedNoteValues = [],
  size = DiagramSize.Small,
}) => {
  const { min: minPos, max: maxPos } = calcSpan(variation);
  
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
  
  const mapSymbols = (positions: Array<number>, barres?: Array<number>) => {
    return map(positions, (s, i) => {
      return times(maxPos - minPos, (f) => {
        const pos = f + minPos;

        if (pos === s) {
          return DiagramSymbol.Note;
        }
        return DiagramSymbol.Empty;
      });
    });
  };

  const diagramLabel = (
    <>
      {map(noteLabels, (p: string, i: number) => (
        <span key={i}>{p}</span>
      ))}
    </>
  );

  return (
    <Diagram
      active={active}
      className="chord"
      diagramLabel={diagramLabel}
      handleClick={() => handleClick(variation)}
      size={size}
      span={calcSpan(variation)}
      symbols={mapSymbols(variation.Positions)}
    />
  );
};
