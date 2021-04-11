import { ApiEntity } from '../../network/ApiEntity';
import { Formation } from './Formation';
import { Tuning } from './Tuning';

export class Instrument extends ApiEntity {
  public DefaultTuning: Tuning;
  public DefaultTuningId: string;
  public Label: string;
  public NumFrets: number;
  public NumStrings: number;
  public Formation: Formation;
}
