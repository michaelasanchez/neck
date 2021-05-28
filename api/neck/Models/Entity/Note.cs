using neck.Enums;
using neck.Interfaces;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models.Entity
{
	public class Note : DbEntity, ILabelled, IEquatable<Note>
    {
        public NoteValue Base { get; set; }

        public NoteSuffix Suffix { get; set; }

        [NotMapped]
        public int? Octave { get; set; }

        [NotMapped]
        public string Label => $"{Base}{SuffixSymbol(Suffix)}";

        [NotMapped]
        public string PlainLabel => $"{Base}{SuffixPlainSymbol(Suffix)}";

        [NotMapped]
        public string SuffixLabel => $"{SuffixSymbol(Suffix)}";

        [NotMapped]
        public int Pitch {
            get => ((int)Base + (int)Suffix + Notes.Count) % Notes.Count;
        }

        // The difference in pitch between two notes,
        //	one being the root note of a scale
        [NotMapped]
        public Interval? Interval { get; set; }

        // Refers to the position of a particular note
        //	on a scale realtive to the tonic
        [NotMapped]
        public ScaleDegree? Degree { get; set; }

        public Note() { }

        public Note(NoteValue value, NoteSuffix suffix = NoteSuffix.Natural, int? octave = null)
        {
            Base = value;
            Suffix = suffix;
            Octave = octave;
        }

        public Note Copy()
        {
            var note = new Note(Base, Suffix, Octave);
            note.Degree = Degree;
            note.Interval = Interval;
            return note;
        }

		#region IEquatable

		public override bool Equals(object obj)
        {
            return Equals(obj as Note);
        }

        public bool Equals(Note other)
        {
            return other != null &&
                   Base == other.Base &&
                   Suffix == other.Suffix;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Base, Suffix);
        }

		#endregion

		private string SuffixSymbol(NoteSuffix suffix)
        {
            switch (suffix)
            {
                case NoteSuffix.Sharp:
                    return "\u266f";
                case NoteSuffix.DoubleSharp:
                    return "\ud834\udd2a";
                case NoteSuffix.Flat:
                    return "\u266d";
                case NoteSuffix.DoubleFlat:
                    return "\ud834\udd2b";
                default:
                    return string.Empty;
            }
        }

        private string SuffixPlainSymbol(NoteSuffix suffix)
        {
            switch (suffix)
            {
                case NoteSuffix.Sharp:
                    return "#";
                case NoteSuffix.DoubleSharp:
                    return "##";
                case NoteSuffix.Flat:
                    return "b";
                case NoteSuffix.DoubleFlat:
                    return "bb";
                default:
                    return string.Empty;
            }
        }

        #region Utilities

        private int stepValue(int value, int step)
        {
            return (value + step) % Notes.Count;
        }

        private NoteValue noteValue(int value, int step) => (NoteValue)stepValue(value, step);

        private bool noteValueExists(int value, int step) => Enum.IsDefined(typeof(NoteValue), stepValue(value, step));

        #endregion

        #region Calculate note intervals & accidentals

        // TODO: Add half/whole step down?
        public Note HalfStepDown()
        {
            throw new NotImplementedException();
        }

        public Note HalfStepUp()
        {
            int step = 1;

            NoteValue nextValue;
            NoteSuffix nextSuffix = NoteSuffix.Natural;

            if (noteValueExists(Pitch, step))
            {
                if (Suffix == NoteSuffix.Flat)
                {
                    nextSuffix = NoteSuffix.Flat;
                    step = 2;
                }
                else if (Suffix == NoteSuffix.DoubleSharp)
                {
                    nextSuffix = NoteSuffix.Sharp;
                    step = 2;
                }
            }
            else
            {
                if (Suffix == NoteSuffix.Sharp || Suffix == NoteSuffix.DoubleSharp)
                {
                    nextSuffix = NoteSuffix.Sharp;
                    step = 0;
                }
                else
                {
                    step = 2;
                    nextSuffix = NoteSuffix.Flat;
                }
            }

            if (!noteValueExists(Pitch, step))
            {
                nextValue = noteValue((int)Base, step);

                if (nextSuffix == NoteSuffix.Flat)
                {
                    nextSuffix = NoteSuffix.DoubleFlat;
                }
            }
            else
			{
                nextValue = noteValue(Pitch, step);
			}
            return new Note((NoteValue)nextValue, nextSuffix);
        }

        //  C           D           E     F           G           A           B   
        //        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
        //  B#                      Fb    E#                                  Cb
        //  0     1     2     3     4     5     6     7     8     9     10    11 

        public Note WholeStepDown()
        {
            throw new NotImplementedException();
        }

        public Note WholeStepUp()
        {
            var step = 2;

            NoteValue nextValue;
            NoteSuffix nextSuffix = NoteSuffix.Natural;

            // TODO: get rid of this
            var calcFromBase = false;

            if (noteValueExists(Pitch, step))
            {
                if (Suffix == NoteSuffix.Sharp)
                {
                    step = 1;
                    nextSuffix = NoteSuffix.Sharp;
                }
                else if (Suffix == NoteSuffix.DoubleFlat)
                {
                    step = 3;
                    if (!noteValueExists(Pitch, step))
					{
                        step = 4;
                        nextSuffix = NoteSuffix.DoubleFlat;
                    }
                    else
                    {
                        nextSuffix = NoteSuffix.Flat;
                    }
				}
				else if (Suffix == NoteSuffix.DoubleSharp)
                {
                    calcFromBase = true;
                }
            }
            else
            {
                if (Suffix == NoteSuffix.Flat)
                {
                    step = 3;
                    nextSuffix = NoteSuffix.Flat;
                }
                else
                {
                    step = 1;
                    nextSuffix = NoteSuffix.Sharp;
                }
            }

            if (!noteValueExists(Pitch, step) || calcFromBase)
            {
                nextValue = noteValue((int)Base, step);

                if (nextSuffix == NoteSuffix.Flat)
                {
                    nextSuffix = NoteSuffix.DoubleFlat;
                }
                else if (nextSuffix == NoteSuffix.Sharp || nextSuffix == NoteSuffix.Natural)
                {
                    nextSuffix = NoteSuffix.DoubleSharp;
                }
            }
            else
            {
                nextValue = noteValue(Pitch, step);
            }
            return new Note(nextValue, nextSuffix);
        }
        #endregion

        #region Natural Note static constructors
        public static Note A()
        {
            return new Note(NoteValue.A, NoteSuffix.Natural);
        }

        public static Note B()
        {
            return new Note(NoteValue.B, NoteSuffix.Natural);
        }

        public static Note C()
        {
            return new Note(NoteValue.C, NoteSuffix.Natural);
        }

        public static Note D()
        {
            return new Note(NoteValue.D, NoteSuffix.Natural);
        }

        public static Note E()
        {
            return new Note(NoteValue.E, NoteSuffix.Natural);
        }

        public static Note F()
        {
            return new Note(NoteValue.F, NoteSuffix.Natural);
        }

        public static Note G()
        {
            return new Note(NoteValue.G, NoteSuffix.Natural);
        }
        #endregion
    }
}
