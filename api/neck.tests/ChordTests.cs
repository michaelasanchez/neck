using neck.Enums;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using static neck.Enums.ChordEnums;

namespace neck.tests
{
	public class ChordTests : TestsBase
	{
		[Theory]
		[InlineData(ChordModifier.Major, "C", "E", "G")]
		[InlineData(ChordModifier.Minor, "C", "Eb", "G")]
		[InlineData(ChordModifier.Diminished, "C", "Eb", "Gb")]
		[InlineData(ChordModifier.Augmented, "C", "E", "G#")]
		[InlineData(ChordModifier.Sus2, "C", "D", "G")]
		[InlineData(ChordModifier.Sus4, "C", "F", "G")]
		[InlineData(ChordModifier.Major7, "C", "E", "G", "B")]
		[InlineData(ChordModifier.Minor7, "C", "Eb", "G", "Bb")]
		[InlineData(ChordModifier.Dominant7, "C", "E", "G", "Bb")]
		[InlineData(ChordModifier.Augmented7, "C", "Eb", "Gb", "Bbb")]
		[InlineData(ChordModifier.Diminished7, "C", "E", "G#", "Bb")]
		//[InlineData(ChordModifier.MajorSixth, "C", "E", "G", "A")]
		//[InlineData(ChordModifier.MinorSixth, "C", "Eb", "G", "A")]
		//[InlineData(ChordModifier.HalfDiminishedSeventh, "C", "Eb", "Gb", "Bbb")]
		public void C_Natural(ChordModifier mod, params string[] toneLabels)
		{
			var note = new Note(NoteValue.C, NoteSuffix.Natural);
			var chord = new Chord(note, mod);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(ChordModifier.Major, "C#", "E#", "G#")]
		[InlineData(ChordModifier.Minor, "C", "E", "G")]
		[InlineData(ChordModifier.Diminished, "C#", "E", "G")]
		[InlineData(ChordModifier.Augmented, "C#", "E#", "G##")]
		[InlineData(ChordModifier.Sus2, "C#", "D#", "G#")]
		[InlineData(ChordModifier.Sus4, "C#", "F#", "G#")]
		[InlineData(ChordModifier.Major7, "C#", "E#", "G#", "B#")]
		[InlineData(ChordModifier.Minor7, "C#", "E", "G#", "B")]
		[InlineData(ChordModifier.Dominant7, "C#", "E#", "G#", "B")]
		[InlineData(ChordModifier.Augmented7, "C#", "E", "G", "Bb")]
		[InlineData(ChordModifier.Diminished7, "C#", "E#", "G##", "B")]
		//[InlineData(ChordModifier.MajorSixth, "C#", "E#", "G#", "A#")]
		//[InlineData(ChordModifier.MinorSixth, "C#", "E", "G#", "A#")]
		public void C_Sharp(ChordModifier mod, params string[] toneLabels)
		{
			var note = new Note(NoteValue.C, NoteSuffix.Sharp);
			var chord = new Chord(note, mod);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(ChordModifier.Major, "Cb", "Eb", "Gb")]
		[InlineData(ChordModifier.Minor, "Cb", "Ebb", "Gb")]
		[InlineData(ChordModifier.Diminished, "Cb", "Ebb", "Gbb")]
		[InlineData(ChordModifier.Augmented, "Cb", "Eb", "G")]
		[InlineData(ChordModifier.Sus2, "Cb", "Db", "Gb")]
		[InlineData(ChordModifier.Sus4, "Cb", "Fb", "Gb")]
		[InlineData(ChordModifier.Major7, "Cb", "Eb", "Gb", "Bb")]
		[InlineData(ChordModifier.Minor7, "Cb", "Ebb", "Gb", "Bbb")]
		[InlineData(ChordModifier.Dominant7, "Cb", "Eb", "Gb", "Bbb")]
		[InlineData(ChordModifier.Augmented7, "Cb", "Ebb", "Gbb", "Bbbb")]
		[InlineData(ChordModifier.Diminished7, "Cb", "Eb", "G", "Bbb")]
		//[InlineData(ChordModifier.MajorSixth, "Cb", "Eb", "Gb", "Ab")]
		//[InlineData(ChordModifier.MinorSixth, "Cb", "Ebb", "Gb", "Ab")]
		public void Theoretical_C_Flat(ChordModifier mod, params string[] toneLabels)
		{
			var note = new Note(NoteValue.C, NoteSuffix.Flat);
			var chord = new Chord(note, mod);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}
	}
}
