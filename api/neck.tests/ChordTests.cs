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
		[InlineData(ChordModifier.DominantSeventh, "C", "E", "G", "Bb")]
		[InlineData(ChordModifier.MajorSeventh, "C", "E", "G", "B")]
		[InlineData(ChordModifier.MinorSeventh, "C", "Eb", "G", "Bb")]
		[InlineData(ChordModifier.MajorSixth, "C", "E", "G", "A")]
		[InlineData(ChordModifier.MinorSixth, "C", "Eb", "G", "A")]
		[InlineData(ChordModifier.SuspendedFour, "C", "F", "G")]
		[InlineData(ChordModifier.SuspendedTwo, "C", "D", "G")]
		[InlineData(ChordModifier.Diminished, "C", "Eb", "Gb")]
		//[InlineData(ChordModifier.HalfDiminishedSeventh, "C", "Eb", "Gb", "Bbb")]
		[InlineData(ChordModifier.DiminishedSeventh, "C", "Eb", "Gb", "Bbb")]
		[InlineData(ChordModifier.Augmented, "C", "E", "G#")]
		[InlineData(ChordModifier.AugmentedSeventh, "C", "E", "G#", "Bb")]
		public void Chord_C_Natural(ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(NoteValue.C, NoteSuffix.Natural);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(ChordModifier.Major, "C#", "E#", "G#")]
		[InlineData(ChordModifier.Minor, "C", "E", "G")]
		[InlineData(ChordModifier.DominantSeventh, "C#", "E#", "G#", "B")]
		[InlineData(ChordModifier.MajorSeventh, "C#", "E#", "G#", "B#")]
		[InlineData(ChordModifier.MinorSeventh, "C#", "E", "G#", "B")]
		[InlineData(ChordModifier.MajorSixth, "C#", "E#", "G#", "A#")]
		[InlineData(ChordModifier.MinorSixth, "C#", "E", "G#", "A#")]
		[InlineData(ChordModifier.SuspendedFour, "C#", "F#", "G#")]
		[InlineData(ChordModifier.SuspendedTwo, "C#", "D#", "G#")]
		[InlineData(ChordModifier.Diminished, "C#", "E", "G")]
		[InlineData(ChordModifier.DiminishedSeventh, "C#", "E", "G", "Bb")]
		[InlineData(ChordModifier.Augmented, "C#", "E#", "G##")]
		[InlineData(ChordModifier.AugmentedSeventh, "C#", "E#", "G##", "B")]
		public void Chord_C_Sharp(ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(NoteValue.C, NoteSuffix.Sharp);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(ChordModifier.Major, "Cb", "Eb", "Gb")]
		[InlineData(ChordModifier.Minor, "Cb", "Ebb", "Gb")]
		[InlineData(ChordModifier.DominantSeventh, "Cb", "Eb", "Gb", "Bbb")]
		[InlineData(ChordModifier.MajorSeventh, "Cb", "Eb", "Gb", "Bb")]
		[InlineData(ChordModifier.MinorSeventh, "Cb", "Ebb", "Gb", "Bbb")]
		[InlineData(ChordModifier.MajorSixth, "Cb", "Eb", "Gb", "Ab")]
		[InlineData(ChordModifier.MinorSixth, "Cb", "Ebb", "Gb", "Ab")]
		[InlineData(ChordModifier.SuspendedFour, "Cb", "Fb", "Gb")]
		[InlineData(ChordModifier.SuspendedTwo, "Cb", "Db", "Gb")]
		[InlineData(ChordModifier.Diminished, "Cb", "Ebb", "Gbb")]
		[InlineData(ChordModifier.DiminishedSeventh, "Cb", "Ebb", "Gbb", "Bbbb")]
		[InlineData(ChordModifier.Augmented, "Cb", "Eb", "G")]
		[InlineData(ChordModifier.AugmentedSeventh, "Cb", "Eb", "G", "Bbb")]
		public void Chord_Theoretical_C_Flat(ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(NoteValue.C, NoteSuffix.Flat);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}
	}
}
