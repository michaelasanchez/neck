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
		public int Pitch { get => ((int)Base + (int)Suffix) % Notes.Count; }

		[NotMapped]
		public int? Degree;

		public Note() { }

		public Note(NoteValue value, NoteSuffix suffix = NoteSuffix.Natural)
		{
			Base = value;
			Suffix = suffix;
		}

		public bool Equals(Note note)
		{
			return this.Base == note.Base && this.Suffix == note.Suffix;
		}

		public override bool Equals(object obj)
		{
			if (obj is Note note)
			{
				return Equals(note);
			}

			return false;
		}

		//public override bool Equals(object obj)
		//{
		//	var note = obj as Note;
		//	return String.Equals(Base, note.Base)
		//		&& String.Equals(Suffix, note.Suffix);
		//}

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

			return new Note((NoteValue)(Pitch + step), nextSuffix);
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
					step = 2;
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

			return new Note((NoteValue)(Pitch + step), nextSuffix);
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
