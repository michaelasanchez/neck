import { map } from 'lodash';
import { Tuning } from '.';
import { Formation } from './Formation';
import { Note } from './Note';

export class Format {
  public Barres: Array<number>;

  public Positions: Array<number>;
}

export class ChordVariation {
  public Offset: number;

  public Formation: Formation;

  public ChordId: string;

  public TuningId: string;

  public Pitches: number[];

  constructor(
    chordId: string,
    offset: number,
    formation: Formation,
    tuning: Tuning
  ) {
    this.ChordId = chordId;

    this.Offset = offset;
    
    this.Formation = formation;;

    this.TuningId = tuning.Id;

    this.Pitches = map(tuning.Offsets, (o: Note, i: number) => {
      const pos = this.Formation.Positions[i];
      if (pos === null) return pos; 
      return (o.Pitch + pos) % Note.NUM_NOTES;
    });
  }
}
