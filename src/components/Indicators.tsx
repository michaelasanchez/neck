import { each, filter, findIndex, map, reduce, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Chord, ChordModifier, ChordVariation, Note, Tuning } from '../models';
import { IAppOptions } from '../shared';

export const VARIATION_OFFSET_DEFAULT = 0;
export const VARIATION_SPAN_DEFAULT = 4;

export const VARIATION_SPAN_INCLUDES_OPEN = false;
export const FILTER_BY_CHORD_FORM = true;

// Returns a fret number based on a Note, tuning
//  offset and an optional minimum fret position
const calcNotePosition = (
  note: Note,
  tuning: number,
  min: number = 0
): number => {
  let pos = (note.Modified - tuning + Note.NUM_NOTES) % Note.NUM_NOTES;
  while (pos < min) pos += Note.NUM_NOTES;
  return pos;
};

// Returns an array of all possible note positions,
//  within a specified range, that form a chord
const calcVariations = (
  chord: Chord,
  tuning: Tuning,
  offset: number = VARIATION_OFFSET_DEFAULT,
  span: number = VARIATION_SPAN_DEFAULT
): ChordVariation[] => {
  // Matches will contain a set of notes for each string / tuning offset
  //  Each note is a component of chord
  if (offset === 0 && VARIATION_SPAN_INCLUDES_OPEN) span++;
  const matches: Note[][] = map(tuning.Offsets, (o: number, i: number) => {
    return filter(chord.Factors, (n) => {
      let pos = calcNotePosition(n, o, offset);
      return pos >= offset && pos <= offset + (span - 1);
    });
  });

  // Calculate number of combinations from matched notes
  const potentialNotes = map(matches, (m) => m.length);
  const numVariations = reduce(potentialNotes, (acc, n) => acc * n);

  // Calculate variations
  let variations: ChordVariation[] = [];
  times(numVariations, (n) => {
    let multiplier = 1;
    const positions = map(potentialNotes, (p, i) => {
      const prev = multiplier;
      multiplier *= p;

      const index = Math.floor(n / prev) % p;
      return calcNotePosition(matches[i][index], tuning.Offsets[i], offset);
    });

    variations.push(new ChordVariation(positions, chord.Modifier, tuning));
  });

  return variations;
};

interface IndicatorsProps {
  options: IAppOptions;
}

const buttonStyle: React.CSSProperties = {
  position: 'fixed',
  width: 100,
  height: 40,
  top: 10,
  left: 10,
};

const prevStyle: React.CSSProperties = {
  ...buttonStyle,
  left: 10,
};

const nextStyle: React.CSSProperties = {
  ...buttonStyle,
  left: 120,
};

export const Indicators: React.FunctionComponent<IndicatorsProps> = ({
  options,
}) => {
  const { tuning, numFrets } = options;

  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(1);
  const [variations, setVariations] = useState<ChordVariation[]>();

  // Init
  useEffect(() => {
    // Test Chord
    const chord = new Chord(Note.C(), ChordModifier.Major);
    const variations: ChordVariation[] = [];

    // Generate chord variations
    const span = VARIATION_SPAN_DEFAULT;
    times(options.numFrets - span + 2, (offset) => {
      each(calcVariations(chord, tuning, offset, span), (newVariation) => {
        // Filter duplicates
        if (findIndex(variations, (v) => v.Equals(newVariation)) < 0)
          variations.push(newVariation);
      });
    });

    // Only keep variations that match a chord form
    let filteredVariations: ChordVariation[];
    if (FILTER_BY_CHORD_FORM) {
      filteredVariations = filter(variations, (v) => v.hasChordForm());
    }

    setVariations(filteredVariations || variations);
  }, []);

  const renderDebug = () => {
    if (!variations) {
      return <></>;
    }

    const getNextVariationIndex = (next: number): number =>
      (currentVariationIndex + variations.length + next) % variations.length;

    return (
      <>
        <Button
          disabled={!variations.length}
          style={prevStyle}
          onClick={() => setCurrentVariationIndex(getNextVariationIndex(-1))}
        >
          Prev
        </Button>
        <Button
          disabled={!variations.length}
          style={nextStyle}
          onClick={() => setCurrentVariationIndex(getNextVariationIndex(1))}
        >
          Next
        </Button>
      </>
    );
  };

  const renderIndicator = (
    fretNum: number,
    show: boolean = false,
    muted: boolean = false,
    barre: boolean = false,
    start: boolean = false
  ) => {
    return (
      <div className={`fret${fretNum === 0 ? ' open' : ''}`} key={fretNum}>
        {show && (
          <div
            className={`indicator${muted ? ' muted' : ''}${
              barre ? (start ? ' barre start' : ' barre') : ''
            }`}
          ></div>
        )}
      </div>
    );
  };

  const renderIndicators = variations && variations.length > 0;

  let currentVariation, barreStart: number;
  if (variations?.length > 0 && currentVariationIndex != null) {
    currentVariation = variations[currentVariationIndex];

    barreStart = findIndex(currentVariation.Barre, (p) => p !== null);
  }

  return (
    <div className="indicators">
      {renderDebug()}
      {renderIndicators &&
        map(tuning.Offsets, (s: number, i: number) => {
          const position = variations[currentVariationIndex].Positions[i];

          const barre = variations[currentVariationIndex].Barre[i];
          const start = i === barreStart;

          const open = position === 0;
          const muted = position === null;

          return (
            <div className="string" key={i}>
              {renderIndicator(0, open || muted, muted)}
              {times(numFrets, (f) => {
                const fretNum = f + 1;
                const showPosition = position === fretNum;
                const showBarre = barre === fretNum;
                return renderIndicator(
                  fretNum,
                  showPosition || showBarre,
                  false,
                  showBarre,
                  start
                );
              })}
            </div>
          );
        })}
    </div>
  );
};
