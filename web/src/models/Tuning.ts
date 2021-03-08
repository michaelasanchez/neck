import { TuningNote } from '.';
import { ApiEntity } from '../network/ApiEntity';

export class Tuning extends ApiEntity {
  public Label: string;
  public Offsets: TuningNote[];

  constructor(label: string, offsets: TuningNote[]) {
    super();
    this.Label = label;
    this.Offsets = offsets;
  }
}
