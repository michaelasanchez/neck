using neck.Enums;
using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
	public class Scale : DbEntity, ILabelled
	{
		private List<Note> _notes;

		// Public
		[NotMapped]
		public string Label => $"{Root.Label} {Type} Scale";

		public Guid RootId;

		public Note Root { get; set; }

		public ScaleType Type { get; set; }

		[NotMapped]
		public Mode Mode { get; private set; }

		[NotMapped]
		public List<Note> Notes
		{
			get
			{
				if (_notes == null && Root != null)
				{
					if (Mode == null)
						Mode = new Mode(getModeType(Type));

					_notes = calcNotes(Root, Mode, Type);
				}

				return _notes;
			}
		}

		public Scale() { }

		// TODO: Chord uses this to define mode explicity
		//	Potentially need to add ScaleType enum values for modes
		internal Scale(Note root, Mode mode)
		{
			Root = root;

			Mode = mode;

			Type = ScaleType.Diatonic;

			_notes = calcNotes(Root, Mode, Type);
		}

		public Scale(Note root, ScaleType type)
		{
			Root = root;

			Type = type;

			Mode = new Mode(getModeType(Type));

			_notes = calcNotes(Root, Mode, Type);
		}


		#region Private Methods

		private ModeType getModeType(ScaleType type)
		{
			switch (type)
			{
				case ScaleType.NaturalMinor:
					return ModeType.Aeolian;
				case ScaleType.Diatonic:
				default:
					return ModeType.Ionian;
			}
		}

		private List<Note> calcNotes(Note root, Mode mode, ScaleType type)
		{
			if (root == null || mode == null) return null;

			root.Degree = ScaleDegree.Tonic;
			root.Interval = Interval.Root;

			var notes = new List<Note> { root };

			mode.Steps.ForEach(step =>
			{
				var nextNote = calcNextNote(notes.Last(), step);
				if (nextNote.Pitch != root.Pitch) notes.Add(nextNote);
			});

			if (type == ScaleType.Pentatonic)
			{
				notes.RemoveAt(3);
				notes.RemoveAt(5);
			}

			return notes;
		}

		private Note calcNextNote(Note prevNote, Step step)
		{
			var nextNote = step == Step.Whole ? prevNote.WholeStepUp() : prevNote.HalfStepUp();

			nextNote.Degree = prevNote.Degree + 1;
			nextNote.Interval = calcInterval(nextNote.Pitch, Root.Pitch);

			return nextNote;
		}

		private Interval calcInterval(int pitch, int rootPitch)
		{
			return (Interval)((pitch - rootPitch + Models.Notes.Count) % Models.Notes.Count);
		}

		#endregion
	}
}
