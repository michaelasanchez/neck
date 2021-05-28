using neck.Enums;
using neck.Models.Entity;
using Xunit;
using static neck.Enums.ChordEnums;

namespace neck.tests
{
	public class ChordTests : TestsBase
	{
		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "Gb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E#", "G#")]
		public void Major(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Major);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Ebb", "Gb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "G")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E", "G#")]
		public void Minor(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Minor);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Ebb", "Gbb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "Gb")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E", "G")]
		public void Diminished(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Diminished);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		//[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Ebb", "Gb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G#")]
		//[InlineData(NoteValue.C, NoteSuffix.Sharp, "Cb", "Eb", "G")]
		public void Augmented(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Augmented);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "Gb", "Bb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G", "B")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E#", "G#", "B#")]
		public void Major7(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Major7);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Ebb", "Gb", "Bbb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "G", "Bb")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E", "G#", "B")]
		public void Minor7(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Minor7);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "Gb", "Bbb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G", "Bb")]
		[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E#", "G#", "B")]
		public void Dominant7(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Dominant7);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		//[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "G", "Bbb")]
		[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G#", "Bb")]
		//[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E#", "G##", "B")]
		public void Augmented7(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, ChordModifier.Augmented7);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		//[Theory]
		//[InlineData(ChordModifier.Sus2, "C", "D", "G")]
		//[InlineData(ChordModifier.Sus4, "C", "F", "G")]
		//[InlineData(ChordModifier.Diminished7, "C", "Eb", "Gb", "Bbb")]
		//[InlineData(ChordModifier.MajorSixth, "C", "E", "G", "A")]
		//[InlineData(ChordModifier.MinorSixth, "C", "Eb", "G", "A")]
		//[InlineData(ChordModifier.HalfDiminishedSeventh, "C", "Eb", "Gb", "Bbb")]
		//public void C_Natural(ChordModifier mod, params string[] toneLabels)
		//{
		//	var note = new Note(NoteValue.C, NoteSuffix.Natural);
		//	var chord = new Chord(note, mod);

		//	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		//}

		//[Theory]
		//[InlineData(ChordModifier.Sus2, "C#", "D#", "G#")]
		//[InlineData(ChordModifier.Sus4, "C#", "F#", "G#")]
		//[InlineData(ChordModifier.Diminished7, "C#", "E", "G", "Bb")]
		//[InlineData(ChordModifier.MajorSixth, "C#", "E#", "G#", "A#")]
		//[InlineData(ChordModifier.MinorSixth, "C#", "E", "G#", "A#")]
		//public void C_Sharp(ChordModifier mod, params string[] toneLabels)
		//{
		//	var note = new Note(NoteValue.C, NoteSuffix.Sharp);
		//	var chord = new Chord(note, mod);

		//	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		//}

		//[Theory]
		//[InlineData(ChordModifier.Sus2, "Cb", "Db", "Gb")]
		//[InlineData(ChordModifier.Sus4, "Cb", "Fb", "Gb")]
		//[InlineData(ChordModifier.Diminished7, "Cb", "Ebb", "Gbb", "Bbbb")]
		//[InlineData(ChordModifier.MajorSixth, "Cb", "Eb", "Gb", "Ab")]
		//[InlineData(ChordModifier.MinorSixth, "Cb", "Ebb", "Gb", "Ab")]
		//public void Theoretical_C_Flat(ChordModifier mod, params string[] toneLabels)
		//{
		//	var note = new Note(NoteValue.C, NoteSuffix.Flat);
		//	var chord = new Chord(note, mod);

		//	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		//}
	}
}
