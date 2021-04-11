import { Note, Scale } from '..';
import { ApiEntity } from '../../network';

export enum KeyType {
  Major,
  Minor,
}

export const getKeyTypeLabel = (type: KeyType): string => {
  switch (type) {
    case KeyType.Major:
      return 'Major';
    case KeyType.Minor:
      return 'Minor';
  }
};

export class Key extends ApiEntity {
  public Tonic: Note;
  public Type: KeyType;

  public Label: string;

  public Scale: Scale;

  constructor(tonic: Note, type?: KeyType) {
    super();

    this.Tonic = tonic;
    this.Type = type || KeyType.Major;
  }

  public Sharp(): Key {
    this.Tonic = this.Tonic.Sharp();
    return this;
  }

  public DoubleSharp(): Key {
    this.Tonic = this.Tonic.DoubleSharp();
    return this;
  }

  public Flat(): Key {
    this.Tonic = this.Tonic.Flat();
    return this;
  }

  public DoubleFlat(): Key {
    this.Tonic = this.Tonic.DoubleFlat();
    return this;
  }

  static A(): Key {
    return new this(Note.A());
  }

  static B(): Key {
    return new this(Note.B());
  }

  static C(): Key {
    return new this(Note.C());
  }

  static D(): Key {
    return new this(Note.D());
  }

  static E(): Key {
    return new this(Note.E());
  }

  static F(): Key {
    return new this(Note.F());
  }

  static G(): Key {
    return new this(Note.G());
  }
}

Key.prototype.toString = function () {
  return this.Name;
};
