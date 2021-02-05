import { filter, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { DropdownSlideIn, ISlideInProps } from '.';
import { NoteSelection } from '../..';
import { Note, NoteValue, Scale, ScaleType, ScaleVariation } from '../../../models';
import { ScaleVariationApi } from '../../../network/ScaleVariationApi';
import { AppOptions, NoteUtils } from '../../../shared';
import { ScaleDiagram } from '../diagrams';

export interface IScaleSlideInProps extends Pick<ISlideInProps, 'devYOffset'> {
  appOptions: AppOptions;
  setAppOptions: (updated: Partial<AppOptions>) => void;
}

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

export const ScaleSlideIn: React.FC<IScaleSlideInProps> = ({
  appOptions,
  setAppOptions,
  devYOffset,
}) => {
  const { instrument, scale, tuning } = appOptions;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ScaleVariation[]>([]);

  const [selected, setSelected] = useState<Note[]>();

  const [loading, setLoading] = useState<boolean>(true);

  const reloadScaleVariation = () => {
    new ScaleVariationApi()
      .GenerateRange({
        baseId: scale.Id,
        tuningId: tuning.Id,
        span: 5,
        offset: 0,
        range: instrument.NumFrets,
      })
      .then((variations: ScaleVariation[]) => {
        setVariations(variations);
        setLoading(false);

        if (variations.length) setAppOptions({ scaleVariation: variations[0] });
      });
  };

  useEffect(() => {
    if (!!scale) {
      setSelected([]);
      reloadScaleVariation();
    }
  }, [appOptions?.scale]);

  const handleSetChordVariation = (
    variation: ScaleVariation,
    index: number
  ) => {
    setAppOptions({ scaleVariation: variation });
    setCurrentIndex(index);
  };

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
        Tonic: updatedTonic || scale.Tonic,
        Type: updatedType !== undefined ? updatedType : scale.Type,
      };

      setLoading(true);
      setAppOptions({ scale: (updated as any) as Scale });
    }
  };

  return (
    <DropdownSlideIn
      devYOffset={devYOffset}
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
      <div className="variations">
        {map(variations, (v, i) => (
          <ScaleDiagram
            key={i}
            active={i == currentIndex}
            highlighted={selected}
            variation={v}
            setVariation={(v) => handleSetChordVariation(v, i)}
          />
        ))}
      </div>
    </DropdownSlideIn>
  );
};
