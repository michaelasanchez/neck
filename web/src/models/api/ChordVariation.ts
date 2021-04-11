import { map } from 'lodash';
import { Formation, Note, Tuning } from '..';
import { ApiEntity } from '../../network';

export class ChordVariation extends ApiEntity {
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
    super();

    this.ChordId = chordId;

    this.Offset = offset;

    this.Formation = formation;

    this.TuningId = tuning.Id;

    this.Pitches = map(tuning.Offsets, (o: Note, i: number) => {
      const pos = this.Formation.Positions[i];
      if (pos === null) return pos;
      return (o.Pitch + pos) % Note.NUM_NOTES;
    });
  }
}
