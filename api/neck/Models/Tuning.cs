using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
    public class Tuning
    {
        public string Label;

        public List<int> Offsets;

        public Tuning(string label, List<int> offsets)
        {
            Label = label;
            Offsets = offsets;
        }

        public static Tuning Standard() {
           return new Tuning("Standard", new List<int> { 4, 9, 2, 7, 11, 4 });
        }
}
}
