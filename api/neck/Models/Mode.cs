using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
    public enum Step
    {
        Half = 1,
        Whole = 2
    }

    public class Mode
    {
        public string Label;

        public List<Step> Steps;

        Mode(string label, List<Step> steps)
        {
            Label = label;
            Steps = steps;
        }

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

        // Major
        public static Mode Ionian()
        {
            return new Mode("Ionian", new List<Step> { Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Whole, Step.Half });
        }

        public static Mode Dorian()
        {
            return new Mode("Dorian", new List<Step> { Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Whole, Step.Half, Step.Whole });
        }

        public static Mode Phrygian()
        {
            return new Mode("Phrygian", new List<Step> { Step.Half, Step.Whole, Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole });
        }

        public static Mode Lydian()
        {
            return new Mode("Lydian", new List<Step> { Step.Whole, Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Half });
        }

        public static Mode Mixolydian()
        {
            return new Mode("Mixolydian", new List<Step> { Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Half, Step.Whole });
        }

        // Minor
        public static Mode Aeolian()
        {
            return new Mode("Aeolian", new List<Step> { Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole });
        }

        public static Mode Locrian()
        {
            return new Mode("Locrian", new List<Step> { Step.Half, Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Whole });
        }
    }
}
