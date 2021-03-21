import { filter, indexOf, lastIndexOf, map, max, min, times } from 'lodash';
import * as React from 'react';
import { useCallback } from 'react';
import { Chord, ChordVariation, Note } from '../../../models';
import { NoteUtils } from '../../../shared';
import { Diagram, DiagramSpan, DiagramSymbol } from './Diagram';

export interface ChordDiagramProps {
  chord: Chord;
  chordVariation: ChordVariation;
  setChordVariation: (options: ChordVariation) => void;
  active?: boolean;
  highlighted?: Note[];
}

const calcSpan = (variation: ChordVariation): DiagramSpan => {
  return {
    min: variation.Offset,
    max: max(variation.Formation.Positions) + 1, // TODO: this is the wrong fix & forces "padding" (?) with incorrect max value
  };
};

const calcDiagramSymbol = (
  note: boolean,
  root: boolean,
  highlighted: boolean
): DiagramSymbol => {
  if (note) {
    if (root) {
      if (highlighted) {
        return DiagramSymbol.HighlightedRoot;
      }
      return DiagramSymbol.Root;
    }
    if (highlighted) {
      return DiagramSymbol.Highlighted;
    }
    return DiagramSymbol.Note;
  }
  return DiagramSymbol.Empty;
};

const mapHeader = (
  positions: Array<number>,
  roots: Array<boolean>,
  highlighted: Array<boolean>
) => {
  const containsOpen = indexOf(positions, 0) > -1;
  const containsMuted = indexOf(positions, null) > -1;

  if (!containsOpen && !containsMuted) return null;

  return map(positions, (s, i) => {
    if (s === null) {
      return DiagramSymbol.Mute;
    }
    return calcDiagramSymbol(s === 0, roots[i], highlighted[i]);
  });
};

const mapSymbols = (
  span: DiagramSpan,
  positions: Array<number>,
  roots: Array<boolean>,
  highlighted: Array<boolean>
) => {
  return times(span.max - span.min, (f) =>
    times(positions.length, (i) => {
      const s = positions[i];
      const pos = f + span.min;

      if (s === null) {
        return DiagramSymbol.Empty;
      }

      return calcDiagramSymbol(pos === s, roots[i], highlighted[i]);
    })
  );
};

const mapBarres = (barres: Array<number>, positions: Array<number>) => {
  return map(barres, (i) => {
    if (i === null) return null;
    const barreFret = positions[i];
    const start = indexOf(positions, barreFret);
    const end = lastIndexOf(positions, barreFret);

    return map(positions, (p, i) => i > start && i <= end);
  });
};

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord: chord,
  chordVariation: variation,
  setChordVariation: handleClick,
  active,
  highlighted: highlightedNotes = [],
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

  const formation = variation.Formation;

  const renderSymbols = useCallback(() => {
    return mapSymbols(span, formation.Positions, chordRoots, chordHighlighted);
  }, [variation, highlightedNotes]);

  const usesHeader =
    min(formation.Positions) < variation.Offset ||
    (variation.Offset > 0 && indexOf(formation.Positions, null) > -1);

  return (
    <Diagram
      active={active}
      className="chord"
      diagramLabel={diagramLabel}
      handleClick={() => handleClick(variation)}
      span={span}
      symbols={renderSymbols()}
      header={
        usesHeader &&
        mapHeader(formation.Positions, chordRoots, chordHighlighted)
      }
      barres={mapBarres(formation.Barres, formation.Positions)}
    />
  );
};
