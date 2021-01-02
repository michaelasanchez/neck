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
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.Major, "C", "E", "G")]
		public void MajorChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}
		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.Minor, "C", "Eb", "G")]
		public void MinorChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}
		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.DominantSeventh, "C", "E", "G", "Bb")]
		public void DominantSeventhChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}
		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.MajorSeventh, "C", "E", "G", "B")]
		public void MajorSeventhChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.MinorSeventh, "C", "Eb", "G", "Bb")]
		public void MinorSeventhChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.MajorSix, "C", "E", "G", "A")]
		public void MajorSixthChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.MinorSix, "C", "Eb", "G", "A")]
		public void MinorSixthChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.SuspendedFour, "C", "F", "G")]
		public void SuspendedFourChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.SuspendedTwo, "C", "D", "G")]
		public void SuspendedTwoChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.Diminished, "C", "Eb", "Gb")]
		public void DiminishedChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.DiminishedSeventh, "C", "Eb", "Gb", "Bb")]
		public void DiminishedSeventhChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.Augmented, "C", "E", "G#")]
		public void AugmentedChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}

		[Theory]
		[InlineData(NoteValue.C, NoteSuffix.Natural, ChordModifier.AugmentedSeventh, "C", "E", "G#", "Bb")]
		public void AugmentedSeventhChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier, params string[] toneLabels)
		{
			var note = new Note(value, suffix);
			var chord = new Chord(note, modifier);

			Assert.Equal(getLabelArray(chord.Tones), toneLabels);
		}
	}
}
