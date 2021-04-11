import { Scale } from '..';
import { ApiEntity } from '../../network';

export class ScaleVariation extends ApiEntity {
  public ScaleId: string;

  public TuningId: string;

  public Label: string;

  public Scale: Scale;

  public Offset: number;

  public Positions: Array<Array<number>>;
}
