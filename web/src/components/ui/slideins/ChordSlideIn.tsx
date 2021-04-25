import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, map } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Button, Collapse, Form } from 'react-bootstrap';
import { DropdownSlideIn, ISlideInProps } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { IGenerateResponseHeader } from '../../../interfaces';
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

const getOptionsLabel = (key: string) => {
  switch (key) {
    case 'enforceChord':
      return 'Enforce chord tones';
    case 'filterInversions':
      return 'Filter inversions';
    case 'insertFirstOpen':
      return 'Insert first open';
    case 'insertOpen':
      return 'Insert open';
    case 'insertMuted':
      return 'Insert muted';
    default:
      return 'error';
  }
};

export const ChordSlideIn: React.FC<IChordSlideInProps> = (props) => {
  const {
    appOptions,
    setAppOptions,
    generateOptions,
    setGenerateOptions,
  } = useAppOptionsContext();
  const { setChordVariation } = useIndicatorsContext();

  // Props
  const { collapse } = props;
  const { chord, instrument, tuning } = appOptions;

  // State
  const [header, setHeader] = useState<
    IGenerateResponseHeader<ChordVariation>
  >();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ChordVariation[]>();

  const [selected, setSelected] = useState<Note[]>();

  const [showOptions, setShowOptions] = useState<boolean>(true);

  const { req: generateVariations, loading } = useRequest(
    new ChordVariationApi().Generate
  );

  // Generate
  useEffect(() => {
    if (
      !!chord &&
      !collapse &&
      !loading &&
      !!tuning &&
      (!variations ||
        header?.BaseId != chord.Id ||
        header?.TuningId != tuning.Id ||
        header?.Range != instrument.NumFrets ||
        (!!header.Tuning &&
          !NoteUtils.OffsetsAreEqual(tuning.Offsets, header.Tuning.Offsets)))
    ) {
      // Handle new instrument
      if (tuning.Offsets.length === 0) {
        setSelected([]);
        setVariations([]);
      } else {
        setSelected([]);
        generateVariations({
          baseId: chord.Id,
          tuningId: tuning.Id,
          // offset: 8,
          // span: 9,
          range: instrument.NumFrets,
          ...generateOptions,
        }).then((newHeader: IGenerateResponseHeader<ChordVariation>) => {
          // TODO: should not have to run this through a constructor
          const newVariations = map(
            newHeader.Variations,
            (v) => new ChordVariation(v.ChordId, v.Offset, v.Formation, tuning)
          );

          setHeader({ ...newHeader, Tuning: { ...tuning }, Variations: null });
          setVariations(newVariations);
          if (newVariations.length) {
            handleSetChordVariation(newVariations[0], 0);
          }
        });
      }
    }
  }, [
    chord,
    instrument.NumFrets,
    tuning,
    tuning?.Offsets,
    collapse,
    generateOptions,
  ]);

  useEffect(() => {
    if (variations?.length) {
      handleSetChordVariation(variations[0], 0);
    }
  }, [variations]);

  // Header Badge Actions
  const handleRootUpdate = (root: Note) => handleChordUpdate(root);
  const handleModifierUpdate = (mod: ChordModifier) =>
    handleChordUpdate(null, mod);

  // Chord App State
  const handleChordUpdate = (root?: Note, mod?: ChordModifier) => {
    let updatedRoot: Note, updatedModifier: ChordModifier;

    if (!!root && !NoteUtils.NotesAreEqual(chord.Root, root)) {
      updatedRoot = root;
    }
    if (mod !== null && mod != chord.Modifier) {
      updatedModifier = mod;
    }

    if (updatedRoot || updatedModifier !== null) {
      const updated = {
        ...chord,
        Root: updatedRoot || chord.Root,
        Modifier:
          updatedModifier !== undefined ? updatedModifier : chord.Modifier,
      };

      setAppOptions({ chord: updated as Chord });
    }
  };

  // ChordVariation App State
  const handleSetChordVariation = (
    variation: ChordVariation,
    index: number
  ) => {
    setChordVariation(variation);
    setCurrentIndex(index);
  };

  /* Title */
  const renderTitle = (
    <>
      <h2>Chords</h2>
      <FontAwesomeIcon
        icon={faCog}
        className={showOptions ? 'active' : ''}
        onClick={() => setShowOptions(!showOptions)}
      />
    </>
  );

  /* Note Selection */
  const renderNoteSelection = (
    <NoteSelection
      notes={chord.Tones}
      selected={selected}
      setSelected={setSelected}
    />
  );

  /* Options */
  const renderOptions = (
    <div className="options">
      <Collapse in={showOptions}>
        <div>
          <div className="options-container">
            <h5>Options</h5>
            <Form>
              {map(
                generateOptions,
                (optionValue: boolean, optionKey: string) => {
                  return (
                    <Form.Group
                      key={optionKey}
                      onClick={() => {
                        generateOptions[optionKey] = !optionValue;
                        setGenerateOptions({ ...generateOptions });
                      }}
                    >
                      <Form.Check
                        type="checkbox"
                        custom
                        label={getOptionsLabel(optionKey)}
                        checked={optionValue}
                        onChange={() => {}}
                      />
                    </Form.Group>
                  );
                }
              )}
            </Form>
            <Button size="sm" variant={'success'}>
              Update
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );

  /* Variations */
  const renderVariations = useCallback(() => {
    return variations?.length ? (
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
  }, [
    variations,
    currentIndex,
    selected,
    appOptions.leftHandMode,
    appOptions.leftHandUi,
    appOptions.autoScroll,
  ]);

  return (
    <DropdownSlideIn
      {...props}
      className="chord"
      title={renderTitle}
      header={renderNoteSelection}
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
            ChordModifier.DiminishedSeventh,
            ChordModifier.SuspendedSecond,
            ChordModifier.SuspendedFourth,
          ],
          getLabel: (mod: ChordModifier) => Chord.getModifierLabel(mod),
          onUpdate: (mod: ChordModifier) => handleModifierUpdate(mod),
        },
      ]}
      loading={variations == null}
    >
      {renderOptions}
      <div className="variations">{renderVariations()}</div>
    </DropdownSlideIn>
  );
};
