import { each } from 'jquery';
import { filter, indexOf, map, max, min, times } from 'lodash';
import * as React from 'react';
import { Chord, ChordVariation, Note, NoteValue } from '../../../models';
import { NoteUtils } from '../../../shared';
import { Diagram, DiagramSize, DiagramSpan, DiagramSymbol } from './Diagram';

export interface ChordDiagramProps {
  chord: Chord;
  chordVariation: ChordVariation;
  setChordVariation: (options: ChordVariation) => void;
  active?: boolean;
  highlighted?: Note[];
  size?: DiagramSize;
}

const calcSpan = (variation: ChordVariation): DiagramSpan => {
  return {
    min: min(variation.Positions),
    max: max(variation.Positions) + 1, // TODO: this is the wrong fix & forces "padding" with incorrect max value
  };
};

const mapSymbols = (
  span: DiagramSpan,
  positions: Array<number>,
  roots: Array<boolean>,
  highlighted: Array<boolean>
) => {
  return map(positions, (s, i) => {
    return times(span.max - span.min, (f) => {
      const pos = f + span.min;

      if (pos === s) {
        if (roots[i]) {
          if (highlighted[i]) {
            return DiagramSymbol.HighlightedRoot;
          }
          return DiagramSymbol.Root;
        }
        if (highlighted[i]) {
          return DiagramSymbol.Highlighted;
        }
        return DiagramSymbol.Note;
      }
      return DiagramSymbol.Empty;
    });
  });
};

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord: chord,
  chordVariation: variation,
  setChordVariation: handleClick,
  active,
  highlighted: highlightedNotes = [],
  size = DiagramSize.Small,
}) => {
  const span = calcSpan(variation);

  const chordRoots = new Array<boolean>(variation.Pitches.length);
  const chordHighlighted = map(variation.Pitches, (p) => false);

  const noteLabels = map(variation.Pitches, (p: number, i: number) => {
    const result = filter(chord.Tones, (t: any) => p == t.Pitch);

    if (result.length) {
      var note = new Note(result[0].Base, result[0].Suffix);

      chordRoots[i] = NoteUtils.NotesAreEqual(note, chord.Root);
      chordHighlighted[i] =
        filter(highlightedNotes, (n) => n.Base === note.Base).length > 0;

      return note.Label;
    }

    return null;
  });

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
      span={span}
      symbols={mapSymbols(
        span,
        variation.Positions,
        chordRoots,
        chordHighlighted
      )}
      barres={variation.Barres}
    />
  );
};
