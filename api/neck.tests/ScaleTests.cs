using neck.Enums;
using neck.Models;
using System;
using System.Collections.Generic;
using Xunit;

namespace neck.tests
{
	public class ScaleTests
	{
		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Eb", "F", "Gb", "Ab", "Bb", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bb", "C", "Db", "Eb", "F", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "F", "G", "Ab", "Bb", "C", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "C", "D", "Eb", "F", "G", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "G", "A", "Bb", "C", "D", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "E", "F", "G", "A", "B")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "A", "B", "C", "D", "E", "F#")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "E", "F#", "G", "A", "B", "C#")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "B", "C#", "D", "E", "F#", "G#")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F#", "G#", "A", "B", "C#", "D#")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C#", "D#", "E", "F#", "G#", "A#")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G#", "A#", "B", "C#", "D#", "E#")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E#", "F#", "G#", "A#", "B#")]
		public void MajorScale(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, Mode.Ionian());

			compareNoteLabels(scale, scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.F, NoteSuffix.Flat, "Fb", "Gb", "Ab", "Bbb", "Cb", "Db", "Eb", "Fb")]
		[InlineData(NoteValue.G, NoteSuffix.Sharp, "G#", "A#", "B#", "C#", "D#", "E#", "F##", "G#")]
		[InlineData(NoteValue.D, NoteSuffix.Sharp, "D#", "E#", "F##", "G#", "A#", "B#", "C##", "D#")]
		[InlineData(NoteValue.A, NoteSuffix.Sharp, "A#", "B#", "C##", "D#", "E#", "F##", "G##", "A#")]
		[InlineData(NoteValue.E, NoteSuffix.Sharp, "E#", "F##", "G##", "A#", "B#", "C##", "D##", "E#")]

		[InlineData(NoteValue.B, NoteSuffix.Sharp, "B#", "C##", "D##", "E#", "F##", "G##", "A##", "B#")]
		public void MajorTheoreticalScale(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, Mode.Ionian());

			compareNoteLabels(scale, scaleLabels);
		}

		[Theory]
		//[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "F", "Gb", "Ab", "Bb", "Cb", "Db")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "C", "Db", "Eb", "F", "Gb", "Ab")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "G", "Ab", "Bb", "C", "Db", "Eb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "Eb", "F", "G", "Ab", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "A", "Bb", "C", "D", "Eb", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "E", "F", "G", "A", "Bb", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "B", "C", "D", "E", "F", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F#", "G", "A", "B", "C", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C#", "D", "E", "F#", "G", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G#", "A", "B", "C#", "D", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E", "F#", "G#", "A", "B")]
		[InlineData(NoteValue.G, NoteSuffix.Sharp, "G#", "A#", "B", "C#", "D#", "E", "F#")]
		[InlineData(NoteValue.D, NoteSuffix.Sharp, "D#", "E#", "F#", "G#", "A#", "B", "C#")]
		//[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E#", "F#", "G#", "A#", "B#")]
		public void MinorScale(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, Mode.Aeolian());

			compareNoteLabels(scale, scaleLabels);
		}

		private void compareNoteLabels(Scale scale, string[] labels)
		{
			for (var i = 0; i < scale.Notes.Count; i++)
			{
				var actualLabel = scale.Notes[i]?.PlainLabel;
				var expectedLabel = labels[i % labels.Length];
				Assert.Equal(expectedLabel, actualLabel);
			}
		}
	}
}
