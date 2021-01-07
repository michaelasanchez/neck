using neck.Enums;
using neck.Factories.Args;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Factories
{
	public class ScaleVariationFactory : IFactory<ScaleVariation, ScaleVariationCreateArgs>
	{

		public List<ScaleVariation> GenerateVariations(Scale scale, Tuning tuning, int offset, int span)
		{
			var variations = new List<ScaleVariation>();

			var scalePositions = mapPositionSpan(scale, tuning, offset, span);
			var scaleDirections = mapScaleDirections(scalePositions, scale, offset, span);

			var variationCounts = scaleDirections.Select(l => l.Count(d => d == ScaleDirection.NextVariation));
			var numVariations = variationCounts.Where(c => c > 0).Aggregate((acc, count) => acc * count * 2);

			var variationPositions = calcVariationPositions(scale, scaleDirections, scalePositions, 0, 0, new List<List<Note>>());

			return variationPositions.Select(p => new ScaleVariation(scale, tuning, p)).ToList();
		}

		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

		#region Private Methods

		private ScaleDegree calcNextDegree(Scale scale, int currentDegree)
		{
			var nextDegree = (ScaleDegree)((currentDegree + 1) % (scale.Notes.Count + 1));
			if ((int)nextDegree == 0) nextDegree++;
			return nextDegree;
		}

		private List<List<Note>> mapPositionSpan(Scale scale, Tuning tuning, int offset, int span)
		{
			var strings = new List<List<Note>>();
			foreach (var o in tuning.Offsets)
			{
				var frets = Enumerable.Repeat<Note>(null, span).ToList();
				for (var p = offset; p < offset + span; p++)
				{
					var pitch = Notes.Normalize(o + p);
					var note = scale.Notes.FirstOrDefault(n => n.Pitch == pitch);
					if (note != null)
					{
						frets[p - offset] = note;
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
						var currentStringIndex = scalePositions[o].FindIndex(n => n != null && n.Degree == nextDegree);
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

					if (nextDirection == ScaleDirection.NextString ||
						nextDirection == ScaleDirection.End) break;
				}
			}

			return directions;
		}

		private new List<List<List<int?>>> calcVariationPositions(Scale scale, List<List<ScaleDirection>> scaleDirections, List<List<Note>> scalePositions, int oStart, int pStart, List<List<Note>> variationPositions)
		{
			var variationTest = new List<List<List<int?>>>();

			Note prevNote = null;
			for (var o = oStart; o < scaleDirections.Count; o++)
			{
				variationPositions.Add(new List<Note>());
				for (var p = pStart; p < scaleDirections[o].Count; p++)
				{
					var direction = scaleDirections[o][p];

					Note note = null;
					if (direction != ScaleDirection.Null)
					{
						var current = scalePositions[o][p];
						if (prevNote == null || current.Degree == calcNextDegree(scale, (int)prevNote.Degree))
						{
							note = current;
							prevNote = note;
						}
					}

					variationPositions[o].Add(note);

					if (direction == ScaleDirection.NextString)
					{
						break;
					}
					else if (direction == ScaleDirection.NextVariation)
					{
						var dup = variationPositions.Select(l => l.Select(n => n).ToList()).ToList();
						variationTest = calcVariationPositions(scale, scaleDirections, scalePositions, o + 1, 0, dup);
					}
				}
			}

			var positions = variationPositions.Select(s => s.Select(f => (int?)f?.Degree).ToList()).ToList();
			variationTest.Add(positions);

			return variationTest;
		}

		#endregion

	}
}
