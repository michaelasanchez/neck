using neck.Enums;
using neck.Models.Entity;
using Xunit;
using static neck.Enums.ChordEnums;

// https://www.basicmusictheory.com/

namespace neck.tests
{
    public class ChordTests : TestsBase
    {
        [Theory]
        [InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "Gb")]
        [InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Bb", "Db")]
        [InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "F", "Ab")]
        [InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "C", "Eb")]
        [InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "G", "Bb")]
        [InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "D", "F")]
        [InlineData(NoteValue.F, NoteSuffix.Natural, "F", "A", "C")]
        [InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G")]
        [InlineData(NoteValue.G, NoteSuffix.Natural, "G", "B", "D")]
        [InlineData(NoteValue.D, NoteSuffix.Natural, "D", "F#", "A")]
        [InlineData(NoteValue.A, NoteSuffix.Natural, "A", "C#", "E")]
        [InlineData(NoteValue.E, NoteSuffix.Natural, "E", "G#", "B")]
        [InlineData(NoteValue.B, NoteSuffix.Natural, "B", "D#", "F#")]
        [InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "A#", "C#")]
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
        [InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Bbb", "Dbb")]
        [InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "Fb", "Abb")]
        [InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "Cb", "Ebb")]
        [InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "Gb", "Bbb")]
        [InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "Db", "Fb")]
        [InlineData(NoteValue.F, NoteSuffix.Natural, "F", "Ab", "Cb")]
        [InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "Gb")]
        [InlineData(NoteValue.G, NoteSuffix.Natural, "G", "Bb", "Db")]
        [InlineData(NoteValue.D, NoteSuffix.Natural, "D", "F", "Ab")]
        [InlineData(NoteValue.A, NoteSuffix.Natural, "A", "C", "Eb")]
        [InlineData(NoteValue.E, NoteSuffix.Natural, "E", "G", "Bb")]
        [InlineData(NoteValue.B, NoteSuffix.Natural, "B", "D", "F")]
        [InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "A", "C")]
        [InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E", "G")]
        public void Diminished(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        {
            var note = new Note(value, suffix);
            var chord = new Chord(note, ChordModifier.Diminished);

            Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        }

        [Theory]
        [InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "G")]
        [InlineData(NoteValue.G, NoteSuffix.Flat, "Gb", "Bb", "D")]
        [InlineData(NoteValue.D, NoteSuffix.Flat, "Db", "F", "A")]
        [InlineData(NoteValue.A, NoteSuffix.Flat, "Ab", "C", "E")]
        [InlineData(NoteValue.E, NoteSuffix.Flat, "Eb", "G", "B")]
        [InlineData(NoteValue.B, NoteSuffix.Flat, "Bb", "D", "F#")]
        [InlineData(NoteValue.F, NoteSuffix.Natural, "F", "A", "C#")]
        [InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G#")]
        [InlineData(NoteValue.G, NoteSuffix.Natural, "G", "B", "D#")]
        [InlineData(NoteValue.D, NoteSuffix.Natural, "D", "F#", "A#")]
        [InlineData(NoteValue.A, NoteSuffix.Natural, "A", "C#", "E#")]
        [InlineData(NoteValue.E, NoteSuffix.Natural, "E", "G#", "B#")]
        [InlineData(NoteValue.B, NoteSuffix.Natural, "B", "D#", "F##")]
        [InlineData(NoteValue.F, NoteSuffix.Sharp, "F#", "A#", "C##")]
        [InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E#", "G##")]
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
        //[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Db", "Gb")]
        //[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "D", "G")]
        //[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "D#", "G#")]
        //public void Sus2(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        //{
        //	var note = new Note(value, suffix);
        //	var chord = new Chord(note, ChordModifier.Sus2);

        //	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        //}


        //[Theory]
        //[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Fb", "Gb")]
        //[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "F", "G")]
        //[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "F#", "G#")]
        //public void Sus4(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        //{
        //	var note = new Note(value, suffix);
        //	var chord = new Chord(note, ChordModifier.Sus4);

        //	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        //}

        //[Theory]
        //[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Ebb", "Gbb", "Bbbb")]
        //[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "Gb", "Bbb")]
        //[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E", "G", "Bb")]
        //public void Diminished7(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        //{
        //	var note = new Note(value, suffix);
        //	var chord = new Chord(note, ChordModifier.Diminished7);

        //	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        //}

        //[Theory]
        //[InlineData(NoteValue.C, NoteSuffix.Flat, "Cb", "Eb", "Gb", "Ab")]
        //[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "E", "G", "A")]
        //[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E#", "G#", "A#")]
        //public void MajorSixth(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        //{
        //	var note = new Note(value, suffix);
        //	var chord = new Chord(note, ChordModifier.MajorSixth);

        //	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        //}

        //[Theory]
        //[InlineData(NoteValue.C, NoteSuffix.Flat, "Ebb", "Gb", "Ab")]
        //[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "G", "A")]
        //[InlineData(NoteValue.C, NoteSuffix.Sharp, "C#", "E", "G#", "A#")]
        //public void MinorSixth(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        //{
        //	var note = new Note(value, suffix);
        //	var chord = new Chord(note, ChordModifier.MinorSixth);

        //	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        //}

        //[Theory]
        //[InlineData(NoteValue.C, NoteSuffix.Natural, "C", "Eb", "Gb", "Bbb")]
        //public void HalfDiminishedSeventh(NoteValue value, NoteSuffix suffix, params string[] toneLabels)
        //{
        //	var note = new Note(value, suffix);
        //	var chord = new Chord(note, ChordModifier.HalfDiminishedSeventh);

        //	Assert.Equal(getLabelArray(chord.Tones), toneLabels);
        //}
    }
}
