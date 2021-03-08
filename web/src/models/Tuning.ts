import { TuningNote } from '.';
import { ApiEntity } from '../network/ApiEntity';

export class Tuning extends ApiEntity {

  public InstrumentId: string;

  public Label: string;
  public Offsets: TuningNote[];

  constructor(instrumentId: string, label: string, offsets: TuningNote[]) {
    super();
    this.InstrumentId = instrumentId;
    this.Label = label;
    this.Offsets = offsets;
  }
}
