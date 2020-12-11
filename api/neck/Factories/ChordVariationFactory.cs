using neck.Comparers;
using neck.Factories.Args;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Generators
{
	public class ChordVariationFactory : IFactory<ChordVariation, ChordVariationCreateArgs>
	{
		private bool VARIATION_SPAN_INCLUDES_OPEN = false;
		private bool FILTER_DUPLICATE_VARIATIONS = true;

		private int ALLOWED_MUTES = 1;

		// Returns a fret number based on a Note, tuning
		//  offset and an optional minimum fret position
		private int? calcNotePosition(Note note, int tuningOffset, int min = 0)
		{
			if (note == null) return null;
			var pos = (note.Pitch - tuningOffset + Notes.Count) % Notes.Count;
			while (pos < min) pos += Notes.Count;
			return pos;
		}

		private bool isNoteInRange(Note note, int tuning, int offset, int span)
		{
			var pos = calcNotePosition(note, tuning, offset);
			return pos >= offset && pos <= offset + (span - 1);
		}

		private bool containsVariation(List<ChordVariation> variations, ChordVariation newVariation)
		{
			for (var i = 0; i < variations.Count; i++)
			{
				var cur = variations[i];
				var matches = true;
				for (var j = 0; j < cur.Formation.Positions.Count; j++)
				{
					if (cur.Formation.Positions[j] != newVariation.Formation.Positions[j])
					{
						matches = false;
						break;
					}
				}
				if (matches) return true;
			}
			return false;
		}

		public List<ChordVariation> GenerateRange(Chord chord, Tuning tuning, int start, int end, int fretSpan)
		{
			var variations = new List<ChordVariation>();

			for (var i = start; i <= end - fretSpan + 1; i++)
			{
				var newVariations = GenerateVariations(chord, tuning, i, fretSpan);

				for (var j = 0; j < newVariations.Count; j++)
				{
					if (FILTER_DUPLICATE_VARIATIONS && !containsVariation(variations, newVariations[j]))
					{
						variations.Add(newVariations[j]);
					}
				}
			}

			return variations;
		}

		public List<ChordVariation> GenerateVariations(Chord chord, Tuning tuning, int fretOffset, int fretSpan)
		//public List<ChordVariation> Create(ChordVariationCreateArgs args)
		{
			//// TODO: figure out where validation goes. It's in the controller now
			//var chord = args.chord;
			//var tuning = args.tuning;
			//var fretOffset = args.fretOffset;
			//var fretSpan = args.fretSpan;

			if (fretOffset == 0 && VARIATION_SPAN_INCLUDES_OPEN == true) fretSpan++;

			// Matches will contain a set of notes for each string (tuning offset)
			//  Each note is a component of chord
			var matches = tuning.Offsets.Select(o => chord.Tones.Where(n => isNoteInRange(n, o, fretOffset, fretSpan)).ToList()).ToList();

			// Calculate number of combinations from matched notes
			var noteCounts = matches.Select(m => m.Count()).ToList();
			var noMatches = noteCounts.Where(m => m == 0).Count();

			// Add mute(s) if needed
			if (noMatches > 0 && noMatches <= ALLOWED_MUTES)
			{
				var index = noteCounts.IndexOf(0);
				noteCounts[index] = 1;
			}

			//
			var numVariations = noteCounts.Aggregate((acc, count) => acc * count);

			// Used to validate variation contains all chord tones
			var toneCheck = chord.Tones.Select(n => false).ToList();

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

					Note note = null;
					if (matches[countIndex].Count() > 0)
					{
						note = matches[countIndex][index];

						// Check tones have been included
						var toneIndex = chord.Tones.IndexOf(chord.Tones.FirstOrDefault(n => n.Equals(note)));
						toneCheck[toneIndex] = true;
					}

					return calcNotePosition(note, tuning.Offsets[countIndex], fretOffset);
				}).ToList();
				// TODO: Eventually we'll want to get rid of this cast
				//	in order to support chords that can ignore specific tunings

				if (toneCheck.All(c => c))
				{
					variations.Add(new ChordVariation(positions, chord, tuning));
				}

				// Reset
				toneCheck.ForEach(c => c = false);
			}

			return variations;
		}
	}
}
