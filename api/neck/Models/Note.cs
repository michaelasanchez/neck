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
				case NoteSuffix.Flat:
					return "\u266d";
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
			int step = 0;
			var nextSuffix = NoteSuffix.Natural;

			if (Enum.IsDefined(typeof(NoteValue), (Pitch + 1) % Notes.Count))
			{
				if (Pitch + 1 == (int)Base)
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
				if (Pitch != (int)Base)
				{
					nextSuffix = NoteSuffix.Sharp;
				}
				else
				{
					step = 2;
					nextSuffix = NoteSuffix.Flat;
				}
			}

			var nextValue = (int)(Pitch + step) % Notes.Count;
			if (!Enum.IsDefined(typeof(NoteValue), nextValue))
			{
				nextValue = (int)(Base + step) % Notes.Count;
				if (nextSuffix == NoteSuffix.Flat)
				{
					nextSuffix = NoteSuffix.DoubleFlat;	// Bbb
				}
				else
				{
					nextSuffix = NoteSuffix.DoubleSharp;	// F##
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
			NoteSuffix nextSuffix = NoteSuffix.Natural;
			if (Enum.IsDefined(typeof(NoteValue), (Pitch + step) % Notes.Count))
			{
				// Basically checking if it's a sharp. 
				if ((Pitch - 1 + Notes.Count) % Notes.Count == (int)Base)
				{
					step = 1;
					nextSuffix = NoteSuffix.Sharp;
				}
				else if (Suffix == NoteSuffix.DoubleFlat)
				{
					step = 3;
					nextSuffix = NoteSuffix.Flat;
				}
			}
			else
			{
				// Basically checking if it's a flat...
				if ((Pitch + 1) % Notes.Count == (int)Base)
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

			var nextValue = (int)(Pitch + step) % Notes.Count;
			if (!Enum.IsDefined(typeof(NoteValue), nextValue))
			{
				nextValue = (int)(Base + step) % Notes.Count;
				if (nextSuffix == NoteSuffix.Flat)
				{
					nextSuffix = NoteSuffix.DoubleFlat;
				}
				else
				{
					nextSuffix = NoteSuffix.DoubleSharp;	// F##, C##
				}
			} else
			{
				// OR
				// nextSuffix = Suffix
				// OR
				// 

				// This barely works for F## -> G## in the scale of A#
				if (Suffix == NoteSuffix.DoubleSharp && (nextValue - (int)Base + Notes.Count) % Notes.Count > step)
				{
					nextValue = (int)(Base + step) % Notes.Count;
					nextSuffix = Suffix;
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
