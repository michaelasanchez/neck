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

			// IF ANYTHING IS SERIOUSLY BROKEN THIS IS THE FIRST PLACE TO LOOk !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
			//return new Note((NoteValue)(Pitch + step), nextSuffix);
			var nextValue = (int)(Pitch + step);
			if (!Enum.IsDefined(typeof(NoteValue), nextValue))
			{
				nextValue = (int)(Base + step) % Notes.Count;
				if (nextSuffix == NoteSuffix.Flat)
				{
					nextSuffix = NoteSuffix.DoubleFlat;
				} else
				{
					nextSuffix = NoteSuffix.DoubleSharp;
				}
			}
			return new Note((NoteValue)nextValue, nextSuffix);
		}

		public Note WholeStepDown()
		{
			int step = 0;

			return new Note();
		}

		public Note WholeStepUp()
		{
			int step;
			NoteSuffix nextSuffix = NoteSuffix.Natural;
			if (Enum.IsDefined(typeof(NoteValue), (Pitch + 2) % Notes.Count))
			{
				if (Pitch - (int)Base > 0)
				{
					step = 1;
					nextSuffix = NoteSuffix.Sharp;
				}
				else
				{
					if (Suffix == NoteSuffix.DoubleFlat)
					{
						step = 3;
						nextSuffix = NoteSuffix.Flat;
					} else
					{
						step = 2;
					}
				}
			}
			else
			{
				if (Pitch + 1 == (int)Base)
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

			var nextValue = (int)(Pitch + step);
			if (!Enum.IsDefined(typeof(NoteValue), nextValue))
			{
				nextValue = (int)(Base + step) % Notes.Count;
				if (nextSuffix == NoteSuffix.Flat)
				{
					nextSuffix = NoteSuffix.DoubleFlat;
				}
				else
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
