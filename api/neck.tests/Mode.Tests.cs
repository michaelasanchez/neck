using neck.Enums;
using neck.Models;
using neck.Models.Entity;
using Xunit;

namespace neck.tests
{
	public class ModeTests : TestsBase
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
		public void Ionian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Ionian));

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Ebb", "Fb", "Gb", "Ab", "Bbb")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Ab", "Bbb", "Cb", "Db", "Eb", "Fb")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Eb", "Fb", "Gb", "Ab", "Bb", "Cb")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bb", "Cb", "Db", "Eb", "F", "Gb")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "F", "Gb", "Ab", "Bb", "C", "Db")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "C", "Db", "Eb", "F", "G", "Ab")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "G", "Ab", "Bb", "C", "D", "Eb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "Eb", "F", "G", "A", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "A", "Bb", "C", "D", "E", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "E", "F", "G", "A", "B", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "B", "C", "D", "E", "F#", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F#", "G", "A", "B", "C#", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C#", "D", "E", "F#", "G#", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G#", "A", "B", "C#", "D#", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E", "F#", "G#", "A#", "B")]
		public void Dorian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Dorian));

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Dbb", "Ebb", "Fb", "Gb", "Abb", "Bbb")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Abb", "Bbb", "Cb", "Db", "Ebb", "Fb")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Ebb", "Fb", "Gb", "Ab", "Bbb", "Cb")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bbb", "Cb", "Db", "Eb", "Fb", "Gb")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "Fb", "Gb", "Ab", "Bb", "Cb", "Db")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "Cb", "Db", "Eb", "F", "Gb", "Ab")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "Gb", "Ab", "Bb", "C", "Db", "Eb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Db", "Eb", "F", "G", "Ab", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "Ab", "Bb", "C", "D", "Eb", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "Eb", "F", "G", "A", "Bb", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "Bb", "C", "D", "E", "F", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F", "G", "A", "B", "C", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C", "D", "E", "F#", "G", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G", "A", "B", "C#", "D", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D", "E", "F#", "G#", "A", "B")]
		public void Phrygian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Phrygian));

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Eb", "F", "Gb", "Ab", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Ab", "Bb", "C", "Db", "Eb", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Eb", "F", "G", "Ab", "Bb", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bb", "C", "D", "Eb", "F", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "F", "G", "A", "Bb", "C", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "C", "D", "E", "F", "G", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "G", "A", "B", "C", "D", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "E", "F#", "G", "A", "B")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "A", "B", "C#", "D", "E", "F#")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "E", "F#", "G#", "A", "B", "C#")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "B", "C#", "D#", "E", "F#", "G#")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F#", "G#", "A#", "B", "C#", "D#")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C#", "D#", "E#", "F#", "G#", "A#")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G#", "A#", "B#", "C#", "D#", "E#")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E#", "F##", "G#", "A#", "B#")]
		public void Lydian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Lydian));

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bbb")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Ab", "Bb", "Cb", "Db", "Eb", "Fb")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Eb", "F", "Gb", "Ab", "Bb", "Cb")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bb", "C", "Db", "Eb", "F", "Gb")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "F", "G", "Ab", "Bb", "C", "Db")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "C", "D", "Eb", "F", "G", "Ab")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "G", "A", "Bb", "C", "D", "Eb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "E", "F", "G", "A", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "A", "B", "C", "D", "E", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "E", "F#", "G", "A", "B", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "B", "C#", "D", "E", "F#", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F#", "G#", "A", "B", "C#", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C#", "D#", "E", "F#", "G#", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G#", "A#", "B", "C#", "D#", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "E#", "F#", "G#", "A#", "B")]
		public void Mixolydian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Mixolydian));

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
		public void Aeolian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Aeolian));

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Dbb", "Ebb", "Fb", "Gbb", "Abb", "Bbb")]
		[InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Abb", "Bbb", "Cb", "Dbb", "Ebb", "Fb")]
		[InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Ebb", "Fb", "Gb", "Abb", "Bbb", "Cb")]
		[InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Bbb", "Cb", "Db", "Ebb", "Fb", "Gb")]
		[InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "Fb", "Gb", "Ab", "Bbb", "Cb", "Db")]
		[InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "Cb", "Db", "Eb", "Fb", "Gb", "Ab")]
		[InlineData(NoteValue.F, NoteSuffix.Natural, "F", "Gb", "Ab", "Bb", "Cb", "Db", "Eb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Db", "Eb", "F", "Gb", "Ab", "Bb")]
		[InlineData(NoteValue.G, NoteSuffix.Natural, "G", "Ab", "Bb", "C", "Db", "Eb", "F")]
		[InlineData(NoteValue.D, NoteSuffix.Natural, "D", "Eb", "F", "G", "Ab", "Bb", "C")]
		[InlineData(NoteValue.A, NoteSuffix.Natural, "A", "Bb", "C", "D", "Eb", "F", "G")]
		[InlineData(NoteValue.E, NoteSuffix.Natural, "E", "F", "G", "A", "Bb", "C", "D")]
		[InlineData(NoteValue.B, NoteSuffix.Natural, "B", "C", "D", "E", "F", "G", "A")]
		[InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "G", "A", "B", "C", "D", "E")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D", "E", "F#", "G", "A", "B")]
		public void Locrian(NoteValue value, NoteSuffix suffix, params string[] scaleLabels)
		{
			var note = new Note(value, suffix);
			var scale = new Scale(note, new Mode(ModeType.Locrian));

			Assert.Equal(getLabelArray(scale.Notes), scaleLabels);
		}
	}
}
