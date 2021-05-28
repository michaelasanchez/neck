using neck.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{

    public class Mode
    {
        private static List<Step> _intervals = new List<Step>
        {
            Step.Whole,
            Step.Whole,
            Step.Half,
            Step.Whole,
            Step.Whole,
            Step.Whole,
            Step.Half
        };

        private static List<Step> _augmentedIntervals = new List<Step>
        {
            Step.Whole,
            Step.Whole,
            Step.Whole,
            Step.Whole,
            Step.Half,
            Step.Whole,
            Step.Half
        };

        /*
         * 
         * Ionian       C   D   E   F   G   A   B   C
         * Dorian       C   D   Eb  F   G   A   Bb  C
         * Phrygian     C   Db  Eb  F   G   Ab  Bb  C
         * Lydian       C   D   E   F#  G   A   B   C
         * Mixolydian   C   D   E   F   G   A   Bb  C
         * Aeolian      C   D   Eb  F   G   Ab  Bb  C
         * Locrian      C   Db  Eb  F   Gb  Ab  Bb  C
         * 
         */

        public string Label { get; set; }

        public ModeType Type { get; set; }

        public List<Step> Steps { get; set; }

        public Mode(ModeType type, bool augmented = false)
		{
            Type = type;
            Label = type.ToString();
            Steps = calcSteps(type, augmented);
		}

        private List<Step> calcSteps(ModeType type, bool augmented)
		{
            var intervals = augmented ? _augmentedIntervals : _intervals;

            return  intervals.Select((s, i) => intervals[(i + (int)type) % intervals.Count]).ToList();
		}
    }
}
