using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using neck.Enums;

namespace neck.Models
{
	public class Note : DbEntity
	{
		public NoteValue Base;
		public NoteSuffix Suffix;

		[NotMapped]
		public string Label => $"{Base}{SuffixSymbol(Suffix)}";

		[NotMapped]
		public string LongLabel => $"{Base} {Suffix}";

		[NotMapped]
		public string PlainLabel => $"{Base}{SuffixPlainSymbol(Suffix)}";

		[NotMapped]
		public int Pitch { get => ((int)Base + (int)Suffix + Notes.Count) % Notes.Count; }

		[NotMapped]
		public int? Degree;

		public Note() { }

		public Note(NoteValue value, NoteSuffix suffix = NoteSuffix.Natural)
		{
			Base = value;
			Suffix = suffix;
		}

		public override bool Equals(object obj)
		{
			if (obj is Note note)
			{
				return this.Base == note.Base &&
					this.Suffix == note.Suffix;
			}

			return false;
		}

		private string SuffixSymbol(NoteSuffix suffix)
		{
			switch (suffix)
			{
				case NoteSuffix.Sharp:
					return "\u266f";
				case NoteSuffix.DoubleSharp:
					return "\u266f\u266f";
				case NoteSuffix.Flat:
					return "\u266d";
				case NoteSuffix.DoubleFlat:
					return "\u266d\u266d";
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

		#region Calculate note intervals & accidentals

		// TODO: Add half/whole step down?
		public Note HalfStepDown()
		{
			int step = 0;

			return new Note();
		}

		public Note HalfStepUp()
		{
			int step = 1;

			var nextValue = (Pitch + step) % Notes.Count;
			var nextSuffix = NoteSuffix.Natural;

			if (Enum.IsDefined(typeof(NoteValue), nextValue))
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

			nextValue = (Pitch + step) % Notes.Count;

			if (!Enum.IsDefined(typeof(NoteValue), nextValue))
			{
				nextValue = (int)(Base + step) % Notes.Count;
				if (nextSuffix == NoteSuffix.Flat)
				{
					nextSuffix = NoteSuffix.DoubleFlat;
				}
			}
			return new Note((NoteValue)nextValue, nextSuffix);
		}

		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

		public Note WholeStepDown()
		{
			int step = 0;

			return new Note();
		}

		public Note WholeStepUp()
		{
			var step = 2;
			var calcFromBase = false;
			NoteSuffix nextSuffix = NoteSuffix.Natural;
			if (Enum.IsDefined(typeof(NoteValue), (Pitch + step) % Notes.Count))
			{
				if (Suffix == NoteSuffix.Sharp)
				{
					step = 1;
					nextSuffix = NoteSuffix.Sharp;
				}
				else if (Suffix == NoteSuffix.DoubleFlat)
				{
					step = 3;
					nextSuffix = NoteSuffix.Flat;
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
					Debug.WriteLine(Suffix);
					step = 1;
					nextSuffix = NoteSuffix.Sharp;
				}
			}

			var nextValue = (int)(Pitch + step) % Notes.Count;
			if (!Enum.IsDefined(typeof(NoteValue), nextValue) || calcFromBase)
			{
				nextValue = (int)(Base + step) % Notes.Count;
				if (nextSuffix == NoteSuffix.Flat)
				{
					nextSuffix = NoteSuffix.DoubleFlat;
				}
				else if (nextSuffix == NoteSuffix.Sharp || nextSuffix == NoteSuffix.Natural)
				{
					nextSuffix = NoteSuffix.DoubleSharp;
				}
			}
			return new Note((NoteValue)nextValue, nextSuffix);
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
