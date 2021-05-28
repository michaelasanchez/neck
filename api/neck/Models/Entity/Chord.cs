using neck.Enums;
using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using static neck.Enums.ChordEnums;

namespace neck.Models.Entity
{
    public class Chord : DbEntity, ILabelled
    {
        private List<Key> _keys;
        private List<Note> _tones;

        public Guid RootId { get; set; }
        public Note Root { get; set; }

        public ChordModifier Modifier { get; set; }

        [NotMapped]
        public string Label => $"{Root?.Label} {Modifier}";

        [NotMapped]
        public List<Key> Keys => _keys;

        [NotMapped]
        public List<Note> Tones
        {
            get
            {
                if (_tones == null && Root != null)
                {
                    _tones = mapComponents(Root, Modifier);
                }

                return _tones;
            }
        }

        public Chord() { }

        public Chord(Note root, ChordModifier modifier)
        {
            Root = root;
            Modifier = modifier;

            _keys = new List<Key>
            {
                new Key(Root, Modifier == ChordModifier.Minor ? KeyType.Minor : KeyType.Major)
            };

            _tones = mapComponents(Root, Modifier);
        }

        //	MAJOR
        //
        //  C           D           E     F           G           A           B   
        //        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
        //  B#                      Fb    E#                                  Cb
        //  0     1     2     3     4     5     6     7     8     9     10    11 

        //	MINOR
        //
        //	

        // I        tonic
        // ii       supertonic
        // iii      mediant
        // IV       subdominant
        // V        dominant
        // vi	      submediant
        // viio     leading tone (#)
        //            / subtonic (b)
        //  / ♭VII

        //  I   ii  iii IV  V   vi  viio
        //  ----------------------------
        //  C   Dm  Em  F   G   Am  Bdim

        private List<Interval> getIntervals(ChordModifier mod)
        {
            // TODO: Currently exist on front end
            switch (mod)
            {
                case ChordModifier.Major:
                    return new List<Interval> { Interval.Root, Interval.MajorThird, Interval.PerfectFifth };
                case ChordModifier.Minor:
                    return new List<Interval> { Interval.Root, Interval.MinorThird, Interval.PerfectFifth };
                case ChordModifier.Diminished:
                    return new List<Interval> { Interval.Root, Interval.MinorThird, Interval.DiminishedFifth };
                case ChordModifier.Augmented:
                    return new List<Interval> { Interval.Root, Interval.MajorThird, (Interval)AugmentedInterval.AugmentedFifth };
                case ChordModifier.Sus2:
                    throw new Exception("Not implemented");
                case ChordModifier.Sus4:
                    throw new Exception("Not implemented");
                case ChordModifier.Major7:
                    return new List<Interval> { Interval.Root, Interval.MajorThird, Interval.PerfectFifth, Interval.MajorSeventh };
                case ChordModifier.Minor7:
                    return new List<Interval> { Interval.Root, Interval.MinorThird, Interval.PerfectFifth, Interval.MinorSeventh };
                case ChordModifier.Dominant7:
                    return new List<Interval> { Interval.Root, Interval.MajorThird, Interval.PerfectFifth, Interval.MinorSeventh };
                case ChordModifier.Augmented7:
                    return new List<Interval> { Interval.Root, Interval.MajorThird, (Interval)AugmentedInterval.AugmentedFifth, Interval.MinorSeventh };
                case ChordModifier.Diminished7:
                    throw new Exception("Not implemented");
                default:
                    return null;
            }
        }

        private List<Note> mapComponents(Note root, ChordModifier modifier)
        {

            var intervals = getIntervals(modifier);

            var scale = new Scale(root, getMode(modifier));

            List<Note> components;
            if (modifier == ChordModifier.Augmented || modifier == ChordModifier.Augmented7)
            {
                components = intervals
                    .Select(i =>
                    {
                        var note = scale.Notes.FirstOrDefault(n => n.Interval == i);
                        Note adjustedNote = null;
                        if (note == null)
                        {
                            var flat = scale.Notes.FirstOrDefault(n => n.Interval == i + 1);
                            if (flat != null && (flat.Interval == Interval.PerfectFifth || flat.Interval == Interval.MajorSeventh))
                            {
                                adjustedNote = new Note(flat.Base, NoteSuffix.Flat);
                            }

                            var sharp = scale.Notes.FirstOrDefault(n => n.Interval == i - 1);
                            if (sharp != null && (sharp.Interval == Interval.PerfectFifth || sharp.Interval == Interval.MajorSeventh))
                            {
                                adjustedNote = new Note(sharp.Base, NoteSuffix.Sharp);
                            }

                            if (adjustedNote != null)
                            {
                                var degreeNote = scale.Notes.FirstOrDefault(n => n.Base == adjustedNote.Base);
                                adjustedNote.Degree = degreeNote.Degree;
                                note = adjustedNote;
                            }
                        }

                        return note;
                    })
                    .ToList();
            }
            else
            {
                components = intervals.Select(i => scale.Notes.FirstOrDefault(n => n.Interval == i)).ToList();
            }

            return components;
        }

        private Mode getMode(ChordModifier mod)
        {
            switch (mod)
            {
                case ChordModifier.Minor:
                case ChordModifier.Minor7:
                    return new Mode(ModeType.Aeolian);
                case ChordModifier.Diminished:
                    return new Mode(ModeType.Locrian);
                case ChordModifier.Dominant7:
                    return new Mode(ModeType.Mixolydian);
                default:
                    return new Mode(ModeType.Ionian);
            }
        }

    }
}
