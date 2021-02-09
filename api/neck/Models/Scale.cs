using neck.Enums;
using neck.Interfaces;
using Newtonsoft.Json;
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
		public string Label => $"{Tonic.Label} {Type} Scale";

		public Guid TonicId;

		public Note Tonic { get; set; }

		public ScaleType Type { get; set; }

		[NotMapped]
		[JsonIgnore]
		public Mode Mode { get; set; }

		[NotMapped]
		public List<Note> Notes
		{
			get
			{
				if (_notes == null && Tonic != null)
				{
					if (Mode == null)
						Mode = new Mode(getModeType(Type));

					_notes = calcNotes(Tonic, Mode, Type);
				}

				return _notes;
			}
		}

		public Scale() { }

		// TODO: Chord uses this to define mode explicity
		//	Potentially need to add ScaleType enum values for modes
		internal Scale(Note root, Mode mode)
		{
			Tonic = root;

			Mode = mode;

			Type = ScaleType.Diatonic;

			_notes = calcNotes(Tonic, Mode, Type);
		}

		public Scale(Note root, ScaleType type)
		{
			Tonic = root;

			Type = type;

			Mode = new Mode(getModeType(Type));

			_notes = calcNotes(Tonic, Mode, Type);
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

			//nextNote.Degree = (ScaleDegree)(((int)prevNote.Degree - 1) % Enum.GetNames(typeof(ScaleDegree)).Length + 1);
			nextNote.Degree = prevNote.Degree + 1;
			nextNote.Interval = calcInterval(nextNote.Pitch, Tonic.Pitch);

			return nextNote;
		}

		private Interval calcInterval(int pitch, int rootPitch)
		{
			return (Interval)((pitch - rootPitch + Models.Notes.Count) % Models.Notes.Count);
		}

		#endregion
	}
}
