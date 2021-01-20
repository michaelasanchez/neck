import { filter, findIndex, indexOf, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { BadgeSlideIn } from '.';

import { SlideIn } from '..';
import { Note, Scale, ScaleType, ScaleVariation } from '../../../models';
import { ScaleVariationApi } from '../../../network/ScaleVariationApi';
import { AppOptions, NoteUtils } from '../../../shared';
import { Diagram, ScaleDiagram } from '../diagrams';

export interface IScaleSlideInProps {
  appOptions: AppOptions;
  setAppOptions: (updated: Partial<AppOptions>) => void;
}

// Badge ScaleType
const types = filter(ScaleType, (m) => isNaN(m));

// Badge Root Note
const notes = [
  Note.A(),
  Note.B().Flat(),
  Note.B(),
  Note.C().Flat(),
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
];

export const ScaleSlideIn: React.FC<IScaleSlideInProps> = ({
  appOptions,
  setAppOptions,
}) => {
  const { instrument, scale, tuning } = appOptions;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ScaleVariation[]>([]);

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

    if (!!type && type !== scale.Type) {
      updatedType = type;
    }

    if (updatedTonic || updatedType) {
      const updated = {
        Tonic: {
          Base: updatedTonic?.Base || scale.Tonic.Base,
          Suffix: updatedTonic?.Suffix || scale.Tonic.Suffix,
        },
        Type: updatedType || scale.Type,
      };

      setLoading(true);
      setAppOptions({ scale: (updated as any) as Scale });
    }
  };

  return (
    <BadgeSlideIn
      className="scale"
      title={<h2>Scale</h2>}
      loading={loading}
      options={[
        {
          active: findIndex(notes, (n) =>
            NoteUtils.NotesAreEqual(n, scale.Tonic)
          ),
          values: notes,
          getLabel: (note: Note) => note.Label,
          onUpdate: (note: Note) => handleNoteUpdate(note),
        },
        {
          // @ts-ignore
          active: findIndex(types, (t) => t == ScaleType[scale.Type]),
          values: types,
          getLabel: (type: ScaleType) => type.toString(),
          onUpdate: (type: ScaleType) => handleTypeUpdate(type),
        },
      ]}
    >
      <div className="variations">
        {map(variations, (v, i) => (
          <ScaleDiagram
            key={i}
            active={i == currentIndex}
            variation={v}
            setVariation={(v) => handleSetChordVariation(v, i)}
          />
        ))}
      </div>
    </BadgeSlideIn>
  );
};
