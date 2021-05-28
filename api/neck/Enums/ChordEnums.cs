using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Enums
{
    public class ChordEnums
    {
        public enum ChordModifier
		{
			Major,
			Minor,			// Aeolian, Dorian, Phryigan
			Diminished,		// Locrian
			Augmented,		// Lydian Augmented
			Sus2,			// Ionian
			Sus4,           // Ionian
			//Flated5		// Lydian
			Major7,			// Dorian
			Minor7,			// Dorian
			Dominant7,		// Mixolydian
			Diminished7,	// 
			Augmented7,
			//MajorSixth,
			//MinorSixth,
		}
    }
}