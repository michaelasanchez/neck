using neck.Factories.Interfaces;
using neck.Factories.Options;
using neck.Models;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using System.Collections.Generic;
using System.Linq;

namespace neck.Generators
{
	public class ChordVariationFactory : IChordVariationFactory
	{

		private static bool FILTER_DUPLICATE_VARIATIONS = true;

		private static bool VARIATION_SPAN_INCLUDES_OPEN = false;

		private ChordVariationGenerateOptions _options { get; set; }

		public List<ChordVariation> Generate(Chord chord, Tuning tuning, int fretOffset, int fretSpan, int fretRange, ChordVariationGenerateOptions options)
		{
			_options = options;

			var variations = new List<ChordVariation>();

			for (var i = fretOffset; i <= fretRange - fretSpan + 1; i++)
			{
				var newVariations = generateSpan(chord, tuning, i, fretSpan);

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

		private List<ChordVariation> generateSpan(Chord chord, Tuning tuning, int fretOffset, int fretSpan)
		{
			if (fretOffset == 0 && VARIATION_SPAN_INCLUDES_OPEN == true) fretSpan++;

			// Matches will contain a set of notes for each string (tuning offset)
			//  Each note is a component of chord
			var matches = tuning.Offsets.Select(o => chord.Tones.Where(n => isNoteInRange(n, o?.Pitch, fretOffset, fretSpan)).ToList()).ToList();

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
						if (_options.InsertOpen && containsNote(chord.Tones, tuning.Offsets[i]))
						{
							matches[i] = new List<Note> { tuning.Offsets[i].Copy() };
							noteCounts[i] = 1;
						}
						else if (_options.InsertMuted)
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
				var excludeFlag = false;

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

				// TODO: decide what this is called or if this should require INSERT_MUTED_NOTES
				// Remove variations that do not begin with root tone
				if (_options.FilterInversions)
				{
					if (_options.InsertMuted)
					{
						for (int i = 0; i < notes.Count; i++)
						{
							if (notes[i] != null && notes[i].Base == chord.Root.Base) break;
							notes[i] = null;
						}
					}
					else
					{
						// TODO: there is probably a better way to do this
						excludeFlag = true;
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

					return calcNotePosition(n, tuning.Offsets[i]?.Pitch, fretOffset, fretSpan);
				}).ToList();

				// Validate & add variation
				if (!excludeFlag && (!_options.EnforceTones || toneCheck.All(c => c == true)))
				{
					// Remove non-open, empty fret rows
					var offset = positions.Select(z => z == 0 ? null : z).Min() ?? fretOffset;

					variations.Add(new ChordVariation(chord, tuning.Id, offset, positions));
				}
			}

			return variations;
		}

		// Returns a fret number based on a Note, tuning
		//  offset and an optional minimum fret position
		private int? calcNotePosition(Note note, int? tuningOffset, int min = 0, int? span = null)
		{
			if (note == null || tuningOffset == null) return null;

			// Calculate absolute position (withing first "octave")
			var pos = (note.Pitch - tuningOffset + Notes.Count) % Notes.Count;

			// Correct min
			while (pos < min) pos += Notes.Count;
			// Correct max
			while (span != null && pos > min + span - 1) pos -= Notes.Count;

			return pos;
		}

		private bool isNoteInRange(Note note, int? tuningOffset, int offset, int span)
		{
			var pos = calcNotePosition(note, tuningOffset, offset);
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
