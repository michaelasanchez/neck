import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, isEqual, map } from 'lodash';
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
      return 'Require root base';
    case 'insertOpen':
      return 'Insert open';
    case 'insertFirstMuted':
      return 'Insert first muted';
    case 'insertMuted':
      return 'Insert muted';
    default:
      return 'error';
  }
};

interface IGenerateOptions {
  [key: string]: boolean | number;
}

export interface GenerateOptions extends IGenerateOptions {
  span: number;
  enforceChord: boolean;
  filterInversions: boolean;
  // insertFirstMuted: boolean;
  insertOpen: boolean;
  insertMuted: boolean;
}

const DefaultGenerateOptions = {
  span: 4,
  enforceChord: true,
  filterInversions: true,
  // insertFirstMuted: false,
  insertOpen: true,
  insertMuted: true,
};

export const ChordSlideIn: React.FC<IChordSlideInProps> = (props) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { setChordVariation } = useIndicatorsContext();

  // Props
  const { collapse } = props;
  const { chord, instrument, tuning } = appOptions;

  // Variation
  const [header, setHeader] = useState<
    IGenerateResponseHeader<ChordVariation>
  >();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ChordVariation[]>();

  // Note Selection
  const [selected, setSelected] = useState<Note[]>();

  // Options
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const [generateOptions, setGenerateOptions] = useState<GenerateOptions>(
    DefaultGenerateOptions
  );
  const [pendingOptions, setPendingOptions] = useState<GenerateOptions>();

  const { req: generateVariations, loading } = useRequest(
    new ChordVariationApi().Generate
  );

  // TODO: Options should really be returned on the header so we can check against them for changes
  // until then I'm just going to put a flag here
  const [optionsUpdateFlag, setOptionsUpdateFlag] = useState<boolean>(false);

  // Generate
  useEffect(() => {
    if (
      optionsUpdateFlag ||
      (!!chord &&
        !collapse &&
        !loading &&
        !!tuning &&
        (!variations ||
          header?.BaseId != chord.Id ||
          header?.TuningId != tuning.Id ||
          header?.Range != instrument.NumFrets ||
          (!!header.Tuning &&
            !NoteUtils.OffsetsAreEqual(tuning.Offsets, header.Tuning.Offsets))))
    ) {
      if (!!optionsUpdateFlag) {
        setOptionsUpdateFlag(false);
      }

      // Handle new instrument
      if (tuning.Offsets.length === 0) {
        setSelected([]);
        setVariations([]);
      } else {
        setSelected([]);
        generateVariations({
          baseId: chord.Id,
          tuningId: tuning.Id,
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
    optionsUpdateFlag,
  ]);

  // Handle current variation update
  useEffect(() => {
    if (variations?.length) {
      handleSetChordVariation(variations[0], 0);
    }
  }, [variations]);

  useEffect(() => {
    if (!!showOptions) {
      setPendingOptions({ ...generateOptions });
    }
  }, [showOptions]);

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

  const handleSetGenerateOptions = (options: GenerateOptions) => {
    setGenerateOptions({ ...options });
    setOptionsUpdateFlag(true);
  };

  const handleSetPendingOptions = (options: Partial<GenerateOptions>) => {
    if (!options.span || options.span >= 1) {
      setPendingOptions({ ...pendingOptions, ...options });
    }
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
  const renderOptions = () => {
    const hasPendingChanges = !isEqual(generateOptions, pendingOptions);
    return (
      <div className="options">
        <Collapse in={showOptions}>
          <div>
            <div className="options-container">
              <h5>Options</h5>
              <Form.Group>
                <Form.Label>Max Frets</Form.Label>
                <Form.Control
                  type="number"
                  value={pendingOptions?.span}
                  onChange={(e: any) =>
                    handleSetPendingOptions({
                      span: parseInt(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <div className="option-checks">
                {map(
                  pendingOptions,
                  (optionValue: boolean, optionKey: string) => {
                    if (optionKey != 'span') {
                      return (
                        <Form.Group
                          key={optionKey}
                          onClick={() => {
                            pendingOptions[optionKey] = !optionValue;
                            setPendingOptions({ ...pendingOptions });
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
                  }
                )}
              </div>
              <Button
                size="sm"
                disabled={!hasPendingChanges}
                variant={hasPendingChanges ? 'success' : 'outline-success'}
                onClick={() => handleSetGenerateOptions(pendingOptions)}
              >
                Update
              </Button>
            </div>
          </div>
        </Collapse>
      </div>
    );
  };

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
      {renderOptions()}
      <div className="variations">{renderVariations()}</div>
    </DropdownSlideIn>
  );
};
