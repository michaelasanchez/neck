using neck.Models;
using neck.Models.Db;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
    public class ChordVariationRepository
    {
        private static bool VARIATION_SPAN_INCLUDES_OPEN = false;

        // Returns a fret number based on a Note, tuning
        //  offset and an optional minimum fret position
        public static int calcNotePosition(Note note, int tuning, int min = 0)
        {
            var pos = (note.Modified - tuning + Notes.Count) % Notes.Count;
            while (pos < min) pos += Notes.Count;
            return pos;
        }

        public static bool isNoteInRange(Note note, int tuning, int offset, int span)
        {
            var pos = calcNotePosition(note, tuning, offset);
            return pos >= offset && pos <= offset + (span - 1);
        }


        public static List<ChordVariation> Generate(Chord chord, Tuning tuning, int offset, int span)
        {
            // Matches will contain a set of notes for each string (tuning offset)
            //  Each note is a component of chord
            if (offset == 0 && VARIATION_SPAN_INCLUDES_OPEN == true) span++;

            var matches = tuning.Offsets.Select(o => chord.Components.Where(n => isNoteInRange(n, o, offset, span)).ToList()).ToList();

            // Calculate number of combinations from matched notes
            var noteCounts = matches.Select(m => m.Count());
            var numVariations = noteCounts.Aggregate((acc, count) => acc * count);

            // Calculate variations
            var variations = new List<ChordVariation>();
            for (var v = 0; v < numVariations; v++)
            {
                var multiplier = 1;
                var positions = noteCounts.Select((count, countIndex) =>
                {
                    var prev = multiplier;
                    multiplier *= count;

                    var index = (v / prev) % count;
                    return calcNotePosition(matches[countIndex][index], tuning.Offsets[countIndex], offset);
                }).ToList();

                // TODO: We only select notes that are present. For now
                variations.Add(new ChordVariation(positions.Cast<int?>().ToList(), chord, tuning));
            }

            return variations;
        }
    }
}
