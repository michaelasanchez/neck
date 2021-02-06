import { map } from 'lodash';
import { Tuning } from '.';
import { Note } from './Note';

export class Format {
  public Barres: Array<number>;

  public Positions: Array<number>;
}

export class ChordVariation {
  public Positions: number[];

  public ChordId: string;

  public Pitches: number[];

  public Barres: number[];

  constructor(
    chordId: string,
    positions: number[],
    barres: number[],
    tuning: Tuning
  ) {
    this.ChordId = chordId;

    this.Positions = positions;
    this.Barres = barres;

    this.Pitches = map(tuning.Offsets, (o: Note, i: number) => {
      return (o.Pitch + this.Positions[i]) % Note.NUM_NOTES;
    });
  }
}
