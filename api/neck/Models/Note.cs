using System;
using System.Diagnostics;
using neck.Enums;

namespace neck.Models
{
    public class Note
    {
        private NoteValue _base;
        private NoteSuffix _suffix;

        private int? _degree;

        public Note(NoteValue value, NoteSuffix suffix = NoteSuffix.Natural)
        {
            _base = value;
            _suffix = suffix;
        }

        public string Label => $"{_base} {_suffix}";

        public NoteValue Base => _base;

        public NoteSuffix Suffix => _suffix;

        public int Degree { get => _degree.GetValueOrDefault(); set => _degree = value; }

        public int Modified { get => ((int)_base + (int)_suffix) % Notes.Count; }

        public Note HalfStepUp()
        {
            int step = 0;
            var nextSuffix = NoteSuffix.Natural;

            if (Enum.IsDefined(typeof(NoteValue), (Modified + 1) % Notes.Count))
            {
                if (Modified + 1 == (int)_base)
                {
                    step = 2;
                    nextSuffix = NoteSuffix.Flat;
                }
                else
                {
                    step = 1;
                }
            }
            else
            {
                if (Modified != (int)_base)
                {
                    nextSuffix = NoteSuffix.Sharp;
                }
                else
                {
                    step = 2;
                    nextSuffix = NoteSuffix.Flat;
                }
            }

            return new Note((NoteValue)(Modified + step), nextSuffix);
        }

        public Note WholeStepUp()
        {
            int step;
            NoteSuffix nextSuffix = NoteSuffix.Natural;
            if (Enum.IsDefined(typeof(NoteValue), (Modified + 2) % Notes.Count))
            {
                if (Modified - (int)_base > 0)
                {
                    step = 1;
                    nextSuffix = NoteSuffix.Sharp;
                }
                else
                {
                    step = 2;
                }
            }
            else
            {
                if (Modified + 1 == (int)_base)
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

            return new Note((NoteValue)(Modified + step), nextSuffix);
        }

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
