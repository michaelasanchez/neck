using neck.Enums;
using neck.Interfaces;
using neck.Models;
using neck.Models.Variations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace neck.Factories
{
	public class ScaleVariationFactory : IVariationFactory<Scale, ScaleVariation>
	{

		public List<ScaleVariation> GenerateVariations(Scale @base, Tuning tuning, int offset, int span)
		{
			Scale scale = @base;


			var variationPositions = new List<List<List<int?>>>();
			try
			{
				var scalePositions = mapNoteSpan(scale, tuning, offset, span);
				var scaleDirections = mapScaleDirections(scalePositions, scale, offset, span);
				variationPositions = calcVariationPositions(scale, tuning, scaleDirections, scalePositions, new List<List<Note>>());
			}
			catch (Exception ex)
			{
				;
			}

			return variationPositions.Select(p => new ScaleVariation(scale, tuning.Id, offset, p)).ToList();
		}

		public List<ScaleVariation> GenerateRange(Scale @base, Tuning tuning, int start, int end, int fretSpan)
		{
			var variations = new List<ScaleVariation>();

			for (var i = start; i <= end - fretSpan + 1; i++)
			{
				var newVariations = GenerateVariations(@base, tuning, i, fretSpan);

				for (var j = 0; j < newVariations.Count; j++)
				{
					//if (FILTER_DUPLICATE_VARIATIONS && !containsVariation(variations, newVariations[j]))
					//{
					variations.Add(newVariations[j]);
					//}
				}
			}

			return variations;
		}

		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

		#region Private Methods

		private ScaleDegree calcNextDegree(Scale scale, int currentDegree)
		{
			// TODO: ScaleDegree is non-zero based. Should it be?
			var nextDegree = (ScaleDegree)((currentDegree + 1) % (scale.Notes.Count + 1));
			if (nextDegree == 0) nextDegree++;

			return nextDegree;
		}

		private List<List<Note>> mapNoteSpan(Scale scale, Tuning tuning, int offset, int span)
		{
			var strings = new List<List<Note>>();
			foreach (var o in tuning.Offsets)
			{
				var frets = Enumerable.Repeat<Note>(null, span).ToList();
				for (var p = offset; p < offset + span; p++)
				{
					var pitch = Notes.Normalize(o.Pitch + p);

					var note = scale.Notes.FirstOrDefault(n => n.Pitch == pitch);
					if (note != null)
					{
						var octave = (int)o.Octave + p / Notes.Count;

						// TODO: Note.Copy();
						var scaleNote = new Note(note.Base, note.Suffix, octave);
						scaleNote.Degree = note.Degree;

						frets[p - offset] = scaleNote;
					}
				}

				strings.Add(frets);
			};

			return strings;
		}

		private List<List<ScaleDirection>> mapScaleDirections(List<List<Note>> scalePositions, Scale scale, int offset, int span)
		{
			var directions = new List<List<ScaleDirection>>();

			for (var o = 0; o < scalePositions.Count; o++)
			{
				directions.Add(new List<ScaleDirection>());
				for (var p = 0; p < span; p++)
				{
					ScaleDirection nextDirection = ScaleDirection.Null;

					var note = scalePositions[o][p];
					if (note != null)
					{
						var nextDegree = calcNextDegree(scale, (int)note.Degree);
						nextDirection = ScaleDirection.End;

						// Next note on current string
						var currentStringIndex = scalePositions[o].FindIndex(p, n => n != null && n.Degree == nextDegree);
						if (currentStringIndex > -1)
						{
							nextDirection = ScaleDirection.NextFret;
						}

						// First note on next string
						if (o < scalePositions.Count - 1)
						{
							var nextStringIndex = scalePositions[o + 1].FindIndex(n => n != null && n.Degree == nextDegree);
							if (nextStringIndex > -1)
							{
								nextDirection = nextDirection == ScaleDirection.NextFret
									? ScaleDirection.NextVariation
									: ScaleDirection.NextString;
							}
						}
					}

					directions[o].Add(nextDirection);

					// Break position loop. Continue offset loop
					if (nextDirection == ScaleDirection.NextString ||
						nextDirection == ScaleDirection.End) break;
				}
			}

			return directions;
		}

		private List<List<List<int?>>> calcVariationPositions(Scale scale, Tuning tuning, List<List<ScaleDirection>> scaleDirections, List<List<Note>> scalePositions, List<List<Note>> variationPositions, int oStart = 0, int pStart = 0, Note prevNote = null)
		{
			var variations = new List<List<List<int?>>>();

			for (var o = oStart; o < scaleDirections.Count; o++)
			{
				var notes = new List<Note>();
				for (var p = pStart; p < scaleDirections[o].Count; p++)
				{
					var direction = scaleDirections[o][p];

					Note note = null;
					if (direction != ScaleDirection.Null)
					{
						var current = scalePositions[o][p];

						var nextOctave = tuning.Offsets[o].Octave + p / Notes.Count;
						//var nextOctave = prevNote.Pitch < current.Pitch ? prevNote.Octave : prevNote.Octave + 1;

						if (prevNote == null ||
							(current.Degree == calcNextDegree(scale, (int)prevNote?.Degree) && current.Octave == nextOctave))
						{
							note = current;
							prevNote = note;
						}
					}

					notes.Add(note);

					if (direction == ScaleDirection.NextString)
					{
						break;
					}
					else if (direction == ScaleDirection.NextVariation)
					{
						// TODO: Has to be a less manual way of doing this
						var positionsDup = variationPositions.Select(l => l.Select(n => n).ToList()).ToList();

						positionsDup.Add(notes.Select(n => n).ToList());

						while (positionsDup[o].Count < scalePositions[o].Count)
							positionsDup[o].Add(null);

						var prevDup = new Note(prevNote.Base, prevNote.Suffix);
						prevDup.Degree = prevNote.Degree;

						variations.AddRange(calcVariationPositions(scale, tuning, scaleDirections, scalePositions, positionsDup, o + 1, 0, prevDup));
					}
				}

				while (notes.Count < scalePositions[o].Count)
					notes.Add(null);

				variationPositions.Add(notes);
			}

			var positions = variationPositions.Select(s => s.Select(f => (int?)f?.Degree).ToList()).ToList();
			variations.Add(positions);

			return variations;
		}

		#endregion

	}
}
