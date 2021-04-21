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

  public LongLabel: string;

  public Scale: Scale;

  constructor(tonic: Note, type?: KeyType) {
    super();

    this.Tonic = tonic;
    this.Type = type || KeyType.Major;

    this.calcLabel();
  }

  public Major(): Key {
    this.Type = KeyType.Major;
    this.calcLabel();
    return this;
  }

  public Minor(): Key {
    this.Type = KeyType.Minor;
    this.calcLabel();
    return this;
  }

  public Sharp(): Key {
    this.Tonic = this.Tonic.Sharp();
    this.calcLabel();
    return this;
  }

  public DoubleSharp(): Key {
    this.Tonic = this.Tonic.DoubleSharp();
    this.calcLabel();
    return this;
  }

  public Flat(): Key {
    this.Tonic = this.Tonic.Flat();
    this.calcLabel();
    return this;
  }

  public DoubleFlat(): Key {
    this.Tonic = this.Tonic.DoubleFlat();
    this.calcLabel();
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

  private calcLabel() {
    this.Label =
      this.Type == KeyType.Minor
        ? this.Tonic.Label.toLowerCase()
        : this.Tonic.Label;
  }
}

Key.prototype.toString = function () {
  return this.Name;
};
