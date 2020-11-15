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

        public static Mode Ionian()
        {
            return new Mode("Ionian", new List<Step> { Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Whole, Step.Half });
        }

        public static Mode Aeolian()
        {
            return new Mode("Aeolian", new List<Step> { Step.Whole, Step.Half, Step.Whole, Step.Whole, Step.Half, Step.Whole, Step.Whole });
        }
    }
}
