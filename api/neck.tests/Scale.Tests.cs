using neck.Enums;
using neck.Models.Entity;
using Xunit;

namespace neck.tests
{
	public class ScaleTests : TestsBase
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
		public void Major(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, ScaleType.Diatonic);

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);

			for (int i = 1; i <= scale.Notes.Count; i++)
			{
				Assert.Equal((ScaleDegree)i, scale.Notes[i - 1].Degree);
			}
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.DoubleFlat, "Cbb", "Dbb", "Ebb", "Fbb", "Gbb", "Abb", "Bbb")]
		[InlineData(NoteValue.G, NoteSuffix.DoubleFlat, "Gbb", "Abb", "Bbb", "Cbb", "Dbb", "Ebb", "Fb")]
		[InlineData(NoteValue.D, NoteSuffix.DoubleFlat, "Dbb", "Ebb", "Fb", "Gbb", "Abb", "Bbb", "Cb")]
		[InlineData(NoteValue.A, NoteSuffix.DoubleFlat, "Abb", "Bbb", "Cb", "Dbb", "Ebb", "Fb", "Gb")]
		[InlineData(NoteValue.E, NoteSuffix.DoubleFlat, "Ebb", "Fb", "Gb", "Abb", "Bbb", "Cb", "Db")]
		[InlineData(NoteValue.B, NoteSuffix.DoubleFlat, "Bbb", "Cb", "Db", "Ebb", "Fb", "Gb", "Ab")]
		[InlineData(NoteValue.F, NoteSuffix.Flat, "Fb", "Gb", "Ab", "Bbb", "Cb", "Db", "Eb")]
		public void Theoretical_DoubleFlat(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, ScaleType.Diatonic);

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.G, NoteSuffix.Sharp, "G#", "A#", "B#", "C#", "D#", "E#", "F##")]
		[InlineData(NoteValue.D, NoteSuffix.Sharp, "D#", "E#", "F##", "G#", "A#", "B#", "C##")]
		[InlineData(NoteValue.A, NoteSuffix.Sharp, "A#", "B#", "C##", "D#", "E#", "F##", "G##")]
		[InlineData(NoteValue.E, NoteSuffix.Sharp, "E#", "F##", "G##", "A#", "B#", "C##", "D##")]
		[InlineData(NoteValue.B, NoteSuffix.Sharp, "B#", "C##", "D##", "E#", "F##", "G##", "A##")]
		[InlineData(NoteValue.F, NoteSuffix.DoubleSharp, "F##", "G##", "A##", "B#", "C##", "D##", "E##")]
		[InlineData(NoteValue.C, NoteSuffix.DoubleSharp, "C##", "D##", "E##", "F##", "G##", "A##", "B##")]
		public void Theoretical_DoubleSharp(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, ScaleType.Diatonic);

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb")]
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
		[InlineData(NoteValue.A, NoteSuffix.Sharp, "A#", "B#", "C#", "D#", "E#", "F#", "G#")]
		public void Minor(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, ScaleType.NaturalMinor);

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);

			for (int i = 1; i <= scale.Notes.Count; i++)
			{
				Assert.Equal((ScaleDegree)i, scale.Notes[i - 1].Degree);
			}
		}
		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Eb", "Gb", "Ab")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Ab", "Bb", "Db", "Eb")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Eb", "F", "Ab", "Bb")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bb", "C", "Eb", "F")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "F", "G", "Bb", "C")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "C", "D", "F", "G")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "G", "A", "C", "D")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "E", "G", "A")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "A", "B", "D", "E")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "E", "F#", "A", "B")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "B", "C#", "E", "F#")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F#", "G#", "B", "C#")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C#", "D#", "F#", "G#")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G#", "A#", "C#", "D#")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E#", "G#", "A#")]
		public void Pentatonic(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, ScaleType.Pentatonic);

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}
	}
}
