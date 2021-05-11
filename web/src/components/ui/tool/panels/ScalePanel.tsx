import { render } from 'enzyme';
import { filter, map } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { NoteSelection, useIndicatorsContext } from '../../..';
import { useAppOptionsContext } from '../../../..';
import { ScaleType } from '../../../../enums';
import { useRequest } from '../../../../hooks';
import { IGenerateResponseHeader } from '../../../../interfaces';
import { Note, Scale, ScaleVariation } from '../../../../models';
import { ScaleVariationApi } from '../../../../network';
import { NoteUtils } from '../../../../shared';
import { ScaleDiagram } from '../../diagrams';
import { PanelDropdown } from '../PanelDropdown';
import { ToolPanel, ToolPanelProps } from './ToolPanel';

const scaleTypeOptions = filter(ScaleType, (t) => !isNaN(t)).map((t) => {
  return { label: Scale.GetScaleTypeLabel(t), value: t };
});

interface ScalePanelProps
  extends Pick<ToolPanelProps, 'className' | 'collapse'> {}

const ScalePanel: React.FunctionComponent<ScalePanelProps> = (props) => {
  // TODO: Same as in ChordPanel. This should really get combined
  const noteOptions = map(NoteUtils.StandardNotes(), (n, i) => {
    return { label: n.Label, value: n };
  });

  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { setScaleVariation } = useIndicatorsContext();

  const { instrument, scale, tuning } = appOptions;
  const { collapse } = props;
  const [header, setHeader] = useState<
    IGenerateResponseHeader<ScaleVariation>
  >();

  const [currentIndex, setCurrentIndex] = useState<number>();
  const [variations, setVariations] = useState<ScaleVariation[]>();

  const [selected, setSelected] = useState<Note[]>();

  const { req: generateVariations, loading } = useRequest(
    new ScaleVariationApi().Generate
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
      handleSetScaleVariation(variations[0], 0);
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
    setScaleVariation(variation);
    setCurrentIndex(index);
  };

  /* Header */
  const renderHeader = (
    <NoteSelection
      notes={scale.Notes}
      selected={selected}
      setSelected={setSelected}
    />
  );

  /* Variations */
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
  }, [
    variations,
    currentIndex,
    selected,
    appOptions.leftHandMode,
    appOptions.leftHandUi,
    appOptions.autoScroll,
  ]);

  /* ButtonGroup */
  const buttonGroup = (
    <>
      <PanelDropdown
        active={{ label: scale.Tonic.Label, value: scale.Tonic }}
        options={noteOptions}
        optionsEqual={NoteUtils.NotesAreEqual}
        onSelect={handleNoteUpdate}
      />
      <PanelDropdown
        active={{
          label: Scale.GetScaleTypeLabel(scale.Type),
          value: scale.Type,
        }}
        options={scaleTypeOptions}
        onSelect={handleTypeUpdate}
      />
    </>
  );

  return (
    <ToolPanel
      className={`scale ${props.className}`}
      title="Scales"
      buttonGroup={buttonGroup}
      header={renderHeader}
    >
      <div className="variations">{renderVariations()}</div>
    </ToolPanel>
  );
};

export const MemoizedScalePanel = React.memo(ScalePanel);
