import { filter, map } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { DropdownSlideIn, ISlideInProps } from '.';
import { useAppOptionsContext } from '../../..';
import { Chord, ChordModifier, ChordVariation, Note } from '../../../models';
import { ChordVariationApi } from '../../../network';
import { NoteUtils } from '../../../shared';
import { NoteSelection } from '../../NoteSelection';
import { ChordDiagram } from '../diagrams';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = false;

export interface IChordSlideInProps extends Pick<ISlideInProps, 'collapse'> {}

// Badge Chord Modifier
const modifiers = filter(ChordModifier, (m) => !isNaN(m));

// Badge Root Note
const notes = [
  Note.C(),
  Note.C().Sharp(),
  // Note.D().Flat(),
  Note.D(),
  Note.D().Sharp(),
  // Note.E().Flat(),
  Note.E(),
  Note.F(),
  Note.F().Sharp(),
  // Note.G().Flat(),
  Note.G(),
  Note.G().Sharp(),
  // Note.A().Flat(),
  Note.A(),
  Note.A().Sharp(),
  // Note.B().Flat(),
  Note.B(),
];

export const ChordSlideIn: React.FC<IChordSlideInProps> = (props) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();

  // Props
  const { collapse } = props;
  const { chord, instrument, tuning } = appOptions;

  // State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ChordVariation[]>();

  const [selected, setSelected] = useState<Note[]>();

  const [loading, setLoading] = useState<boolean>(!collapse);

  // Side Effects
  useEffect(() => {
    if (!!chord && !collapse) {
      setSelected([]);
      reloadChordVariations();
    }
  }, [chord]);

  useEffect(() => {
    if (!variations && !collapse && !loading) {
      setSelected([]);
      reloadChordVariations();
    }
  }, [collapse]);
  // }, [chord, collapse]);

  // Load
  const reloadChordVariations = () => {
    new ChordVariationApi()
      .GenerateRange({
        baseId: chord.Id,
        tuningId: tuning.Id,
        range: instrument.NumFrets,
      })
      .then((variations: any[]) => {
        // TODO: should not have to run this through a constructor
        const newVariations = map(
          variations,
          (v) =>
            new ChordVariation(
              chord.Id,
              v.Formation.Positions,
              v.Formation.Barres,
              tuning
            )
        );

        setVariations(newVariations);
        if (newVariations.length) {
          handleSetChordVariation(newVariations[0], 0);
        }
      });
  };

  // Render State
  const modifier = chord?.Modifier;

  // Header Badge Actions
  const handleRootUpdate = (root: Note) => handleChordUpdate(root);
  const handleModifierUpdate = (mod: ChordModifier) =>
    handleChordUpdate(null, mod);

  // State Updates
  const handleChordUpdate = (root?: Note, mod?: ChordModifier) => {
    let updatedRoot: Note, updatedModifier: ChordModifier;

    if (!!root && !NoteUtils.NotesAreEqual(chord.Root, root)) {
      updatedRoot = root;
    }
    if (mod !== null && mod != modifier) {
      updatedModifier = mod;
    }

    if (updatedRoot || updatedModifier !== null) {
      const updated = {
        ...chord,
        Root: updatedRoot || chord.Root,
        Modifier: updatedModifier !== undefined ? updatedModifier : modifier,
      };

      setAppOptions({ chord: updated as Chord });
    }
  };

  const handleSetChordVariation = (
    variation: ChordVariation,
    index: number
  ) => {
    setAppOptions({ chordVariation: variation });
    setCurrentIndex(index);
    setLoading(false);
  };
  
  const renderVariations = useCallback(() => {
    return variations?.length > 0 ? (
      map(variations, (v: ChordVariation, i: number) => (
        <ChordDiagram
          active={i == currentIndex}
          chord={chord}
          chordVariation={v}
          highlighted={selected}
          key={i}
          setChordVariation={(v) => handleSetChordVariation(v, i)}
        />
      ))
    ) : (
      <> Nope!</>
    );
  }, [variations, currentIndex, selected]);

  return (
    <DropdownSlideIn
      {...props}
      className="chord"
      title={
        <h2>
          Chord{' '}
          {/* <span className="h6 text-muted">({variations?.length || 0})</span> */}
        </h2>
      }
      options={[
        {
          active: chord.Root,
          values: notes,
          valuesEqual: NoteUtils.NotesAreEqual,
          getLabel: (n: Note) => n.Label,
          onUpdate: (n: Note) => handleRootUpdate(n),
        },
        {
          active: chord.Modifier,
          values: modifiers,
          disabled: [
            ChordModifier.Diminished,
            ChordModifier.SuspendedSecond,
            ChordModifier.SuspendedFourth,
            ChordModifier.AugmentedSeventh,
          ],
          getLabel: (mod: ChordModifier) => Chord.getModifierLabel(mod),
          onUpdate: (mod: ChordModifier) => handleModifierUpdate(mod),
        },
      ]}
      header={
        <NoteSelection
          notes={chord.Tones}
          selected={selected}
          setSelected={setSelected}
        />
      }
      loading={variations == null}
    >
      <div className="variations">{renderVariations()}</div>
    </DropdownSlideIn>
  );
};
