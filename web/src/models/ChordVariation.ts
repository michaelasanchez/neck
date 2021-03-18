import { map } from 'lodash';
import { Tuning } from '.';
import { Note } from './Note';

export class Format {
  public Barres: Array<number>;

  public Positions: Array<number>;
}

export class ChordVariation {
  public Offset: number;

  public Positions: number[];

  public ChordId: string;

  public TuningId: string;

  public Pitches: number[];

  public Barres: number[];

  constructor(
    chordId: string,
    offset: number,
    positions: number[],
    barres: number[],
    tuning: Tuning
  ) {
    this.ChordId = chordId;

    this.Offset = offset;
    
    this.Positions = positions;
    this.Barres = barres;

    this.TuningId = tuning.Id;

    this.Pitches = map(tuning.Offsets, (o: Note, i: number) => {
      const pos = this.Positions[i];
      if (pos === null) return pos; 
      return (o.Pitch + pos) % Note.NUM_NOTES;
    });
  }
}
