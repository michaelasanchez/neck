﻿using neck.Interfaces;
using neck.Models;
using neck.Models.Variations;
using System.Collections.Generic;
using System.Linq;

namespace neck.Generators
{
	public class ChordVariationFactory : IVariationFactory<Chord, ChordVariation>
	{
		private bool VARIATION_SPAN_INCLUDES_OPEN = false;
		private bool FILTER_DUPLICATE_VARIATIONS = true;

		private int ALLOWED_OUT_OF_SPAN = 5;
		private int ALLOWED_MUTES = 5;
		private int ALLOWED_OPEN = 5;

		public List<ChordVariation> GenerateVariations(Chord @base, Tuning tuning, int fretOffset, int fretSpan)
		{
			var chord = @base;

			if (fretOffset == 0 && VARIATION_SPAN_INCLUDES_OPEN == true) fretSpan++;

			// Matches will contain a set of notes for each string (tuning offset)
			//  Each note is a component of chord
			var matches = tuning.Offsets.Select(o => chord.Tones.Where(n => isNoteInRange(n, o, fretOffset, fretSpan)).ToList()).ToList();

			// Calculate number of combinations from matched notes
			var noteCounts = matches.Select(m => m.Count()).ToList();
			var noMatches = noteCounts.Where(m => m == 0).Count();

			// Add mute & open notes
			if (noMatches > 0 && noMatches <= ALLOWED_OUT_OF_SPAN)
			{
				int min = 0, mutes = 0, open = 0;
				for (var i = 0; i < noteCounts.Count && min < noteCounts.Count; i++)
				{
					if (open < ALLOWED_OPEN)
					{
						if (containsNote(chord.Tones, calcNoteFromPosition(chord, tuning.Offsets[i], 0)))
						{
							// TODO: FINISH
						}
					}
					else if (mutes < ALLOWED_MUTES)
					{
						var index = noteCounts.IndexOf(0, min);
						if (index >= 0)
						{
							min = index + 1;
							noteCounts[index] = 1;
							mutes++;
						}
					}
				}
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

				if (toneCheck.All(c => c))
				{
					variations.Add(new ChordVariation(chord, tuning.Id, positions));
				}

				// Reset
				toneCheck.ForEach(c => c = false);
			}

			return variations;
		}

		public List<ChordVariation> GenerateRange(Chord @base, Tuning tuning, int start, int end, int fretSpan)
		{
			var variations = new List<ChordVariation>();

			for (var i = start; i <= end - fretSpan + 1; i++)
			{
				var newVariations = GenerateVariations(@base, tuning, i, fretSpan);

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


		#region Private Methods

		// Returns a fret number based on a Note, tuning
		//  offset and an optional minimum fret position
		private int? calcNotePosition(Note note, int tuningOffset, int min = 0)
		{
			if (note == null) return null;
			var pos = (note.Pitch - tuningOffset + Notes.Count) % Notes.Count;
			while (pos < min) pos += Notes.Count;
			return pos;
		}

		// Returns a note from a given offset/fret position
		private Note calcNoteFromPosition(Chord chord, int tuningOffset, int notePosition)
		{
			var root = chord.Root;

			// TODO: FINISH

			return root;
		}

		private bool isNoteInRange(Note note, int tuning, int offset, int span)
		{
			var pos = calcNotePosition(note, tuning, offset);
			return pos >= offset && pos <= offset + (span - 1);
		}

		private bool containsNote(List<Note> noteList, Note note)
		{
			return noteList.FirstOrDefault(n => n.Equals(note)) != null;
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

		#endregion
	}
}
