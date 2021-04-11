import { Note } from '..';
import { ScaleType } from '../../enums';
import { ApiEntity } from '../../network';

//  C           D           E     F           G           A           B
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11

export class Scale extends ApiEntity {
  public Type: ScaleType;

  public Tonic: Note;

  public Notes: Note[];
}
