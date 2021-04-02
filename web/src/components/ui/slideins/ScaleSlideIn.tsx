import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, map } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { DropdownSlideIn, ISlideInProps } from '.';
import { NoteSelection } from '../..';
import { useAppOptionsContext } from '../../..';
import { useRequest } from '../../../hooks';
import { IGenerateResponseHeader } from '../../../interfaces';
import { Note, Scale, ScaleType, ScaleVariation } from '../../../models';
import { ScaleVariationApi } from '../../../network/ScaleVariationApi';
import { NoteUtils } from '../../../shared';
import { ScaleDiagram } from '../diagrams';

export interface IScaleSlideInProps
  extends Pick<ISlideInProps, 'devYOffset' | 'collapse'> {}

// Badge ScaleType
const types = filter(ScaleType, (m) => !isNaN(m));

// Badge Tonic Note
const notes = [
  Note.C(),
  Note.C().Sharp(),
  Note.D().Flat(),
  Note.D(),
  Note.E().Flat(),
  Note.E(),
  Note.F(),
  Note.F().Sharp(),
  Note.G().Flat(),
  Note.G(),
  Note.A().Flat(),
  Note.A(),
  Note.B().Flat(),
  Note.B(),
];

const getScaleTypeLabel = (type: ScaleType) => {
  switch (type) {
    case ScaleType.Diatonic:
      return 'Major';
    case ScaleType.NaturalMinor:
      return 'Minor';
    case ScaleType.Chromatic:
      return 'Chromatic';
    case ScaleType.Pentatonic:
      return 'Pentatonic';
  }
};

export const ScaleSlideIn: React.FC<IScaleSlideInProps> = (props) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();

  const { instrument, scale, tuning } = appOptions;
  const { collapse } = props;

  const [header, setHeader] = useState<
    IGenerateResponseHeader<ScaleVariation>
  >();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ScaleVariation[]>();

  const [selected, setSelected] = useState<Note[]>();

  const { req: generateVariations, loading } = useRequest(
    new ScaleVariationApi().GenerateRange
  );

  useEffect(() => {
    if (
      !!scale &&
      !!tuning &&
      !collapse &&
      !loading &&
      (!variations ||
        header?.BaseId != scale.Id ||
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
          baseId: scale.Id,
          tuningId: tuning.Id,
          span: 5,
          offset: 0,
          range: instrument.NumFrets,
        }).then((newHeader: IGenerateResponseHeader<ScaleVariation>) => {
          setHeader({ ...newHeader, Variations: null });
          setVariations(newHeader.Variations);
          if (newHeader.Variations.length) {
            handleSetScaleVariation(newHeader.Variations[0], 0);
          }
        });
      }
    }
  }, [instrument.NumFrets, scale, tuning, collapse]);

  useEffect(() => {
    if (variations?.length) {
      setAppOptions({ scaleVariation: variations[0] });
    }
  }, [variations]);

  const handleNoteUpdate = (tonic: Note) => handleScaleUpdate(tonic);
  const handleTypeUpdate = (type: ScaleType) => handleScaleUpdate(null, type);

  const handleScaleUpdate = (tonic?: Note, type?: ScaleType) => {
    let updatedTonic: Note, updatedType: ScaleType;

    if (!!tonic && !NoteUtils.NotesAreEqual(scale.Tonic, tonic)) {
      updatedTonic = tonic;
    }

    if (type !== undefined && type !== scale.Type) {
      updatedType = type;
    }

    if (updatedTonic || updatedType !== undefined) {
      const updated = {
        ...scale,
        Tonic: updatedTonic || scale.Tonic,
        Type: updatedType !== undefined ? updatedType : scale.Type,
      };

      setAppOptions({ scale: updated as Scale });
    }
  };

  const handleSetScaleVariation = (
    variation: ScaleVariation,
    index: number
  ) => {
    setAppOptions({ scaleVariation: variation });
    setCurrentIndex(index);
  };

  const renderVariations = useCallback(() => {
    return map(variations, (v, i) => (
      <ScaleDiagram
        key={i}
        active={i == currentIndex}
        highlighted={selected}
        variation={v}
        setVariation={(v) => handleSetScaleVariation(v, i)}
      />
    ));
  }, [variations, currentIndex, selected, appOptions.leftHandMode, appOptions.leftHandUi, appOptions.autoScroll]);

  return (
    <DropdownSlideIn
      {...props}
      className="scale"
      title={<h2>Scale</h2>}
      loading={loading}
      header={
        <NoteSelection
          notes={scale.Notes}
          selected={selected}
          setSelected={setSelected}
        />
      }
      options={[
        {
          active: scale.Tonic,
          values: notes,
          valuesEqual: NoteUtils.NotesAreEqual,
          getLabel: (note: Note) => note.Label,
          onUpdate: (note: Note) => handleNoteUpdate(note),
        },
        {
          active: scale.Type,
          disabled: [ScaleType.Chromatic],
          values: types,
          getLabel: (type: ScaleType) => getScaleTypeLabel(type),
          onUpdate: (type: ScaleType) => handleTypeUpdate(type),
        },
      ]}
    >
      <div className="variations">{renderVariations()}</div>
    </DropdownSlideIn>
  );
};
