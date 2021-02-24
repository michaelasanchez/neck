using neck.Interfaces;
using neck.Models;
using neck.Models.Variations;
using System.Collections.Generic;
using System.Linq;

namespace neck.Generators
{
	public class ChordVariationFactory : IVariationFactory<Chord, ChordVariation>
	{
		private bool ENFORCE_CHORD_TONES = true;

		private bool INSERT_OPEN_NOTES = true;
		private bool INSERT_MUTED_NOTES = true;

		private bool FILTER_INVERSIONS = true;
		private bool FILTER_DUPLICATE_VARIATIONS = true;

		private bool VARIATION_SPAN_INCLUDES_OPEN = false;

		public List<ChordVariation> GenerateVariations(Chord @base, Tuning tuning, int fretOffset, int fretSpan)
		{
			var chord = @base;

			if (fretOffset == 0 && VARIATION_SPAN_INCLUDES_OPEN == true) fretSpan++;

			// Matches will contain a set of notes for each string (tuning offset)
			//  Each note is a component of chord
			var matches = tuning.Offsets.Select(o => chord.Tones.Where(n => isNoteInRange(n, o.Pitch, fretOffset, fretSpan)).ToList()).ToList();

			// Calculate number of combinations from matched notes
			var noteCounts = matches.Select(m => m.Count()).ToList();

			// Attempt to fill spans with no note matches
			if (noteCounts.Where(m => m == 0).Count() > 0)
			{
				for (var i = 0; i < noteCounts.Count; i++)
				{
					if (noteCounts[i] == 0)
					{
						// Add open note if it fits in our chord
						if (INSERT_OPEN_NOTES && containsNote(chord.Tones, tuning.Offsets[i]))
						{
							matches[i] = new List<Note> { tuning.Offsets[i].Copy() };
							noteCounts[i] = 1;
						}
						else if (INSERT_MUTED_NOTES)
						{
							noteCounts[i] = 1;
						}

						// Need this for open & forced mutes
						noteCounts[i] = 1;
					}
				}
			}

			//
			var numVariations = noteCounts.Aggregate((acc, count) => acc * count);

			// Calculate variations
			var variations = new List<ChordVariation>();
			for (var v = 0; v < numVariations; v++)
			{

				var multiplier = 1;
				var notes = noteCounts.Select((count, countIndex) =>
				{
					var prev = multiplier;
					multiplier *= count;

					var index = (v / prev) % count;

					Note note = null;
					if (matches[countIndex].Count() > 0)
					{
						note = matches[countIndex][index];
					}

					return note;
				}).ToList();

				// Remove variations that do not begin with root tone
				if (FILTER_INVERSIONS)
				{
					for (int i = 0; i < notes.Count; i++)
					{
						if (notes[i] != null && notes[i].Base == chord.Root.Base) break;
						notes[i] = null;
					}
				}

				// Ensure notes contain all chord tones &
				//	map to positions
				var toneCheck = chord.Tones.Select(n => false).ToList();
				var positions = notes.Select((n, i) =>
				{
					if (n != null)
					{
						var toneIndex = chord.Tones.IndexOf(chord.Tones.FirstOrDefault(z => z.Equals(n)));
						toneCheck[toneIndex] = true;
					}

					return calcNotePosition(n, tuning.Offsets[i].Pitch, fretOffset, fretSpan);
				}).ToList();

				// Validate & add variation
				if (!ENFORCE_CHORD_TONES || toneCheck.All(c => c == true))
				{
					// Remove non-open, empty fret rows
					var offset = positions.Select(z => z == 0 ? null : z).Min().Value;

					variations.Add(new ChordVariation(chord, tuning.Id, offset, positions));
				}
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
					var isDuplicate = containsVariation(variations, newVariations[j]);
					if (FILTER_DUPLICATE_VARIATIONS && !isDuplicate)
					{
						variations.Add(newVariations[j]);
					}
					else if (!isDuplicate)
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
		private int? calcNotePosition(Note note, int tuningOffset, int min = 0, int? span = null)
		{
			if (note == null) return null;

			// Calculate absolute position (withing first "octave")
			var pos = (note.Pitch - tuningOffset + Notes.Count) % Notes.Count;

			// Correct min
			while (pos < min) pos += Notes.Count;
			// Correct max
			while (span != null && pos > min + span - 1) pos -= Notes.Count;

			return pos;
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
