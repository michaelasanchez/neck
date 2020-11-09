import React from 'react';
import { Chord } from '../../models';

export interface IChordDiagramProps {
  chord: Chord;
}

export const ChordDiagram: React.FC<IChordDiagramProps> = ({
  chord
}) => {

  console.log(chord.Factors)
  return <></>;
};
