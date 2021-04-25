using neck.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{

    public class Mode
    {
        private static List<Step> _intervals = new List<Step> { Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Whole, Step.Half };

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

        public Mode(ModeType type)
		{
            Type = type;
            Label = type.ToString();
            Steps = calcSteps(type);
		}

        private List<Step> calcSteps(ModeType type)
		{
            return  _intervals.Select((s, i) => _intervals[(i + (int)type) % _intervals.Count]).ToList();
		}
    }
}
