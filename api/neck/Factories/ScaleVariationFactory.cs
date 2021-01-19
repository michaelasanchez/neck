using neck.Enums;
using neck.Interfaces;
using neck.Models;
using neck.Models.Variations;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace neck.Factories
{
	public class ScaleVariationFactory : IVariationFactory<Scale, ScaleVariation>
	{

		public List<ScaleVariation> GenerateVariations(Scale @base, Tuning tuning, int offset, int span)
		{
			Scale scale = @base;

			List<List<List<ScaleDirection>>> test;
			List<ScaleVariation> test2 = new List<ScaleVariation>();

			var scaleVariations = new List<ScaleVariation>();
			try
			{
				var scaleNotes = mapScaleNotes(scale, tuning, offset, span);
				var scaleDirections = mapScaleDirections(scaleNotes, scale, offset, span);

				test = otherSide(new List<List<ScaleDirection>>(), scaleNotes, scale, tuning, offset, span);
				test2 = itDependsOnThePuppet(scale, tuning, offset, test, scaleNotes);

				scaleVariations = calcVariationPositions(scale, tuning, offset, scaleDirections, scaleNotes, new List<List<Note>>());
			}
			catch (Exception ex)
			{
				;
			}

			return test2;
		}

		public List<ScaleVariation> GenerateRange(Scale @base, Tuning tuning, int start, int end, int fretSpan)
		{
			var variations = new List<ScaleVariation>();
			var variationStrings = new List<string>();

			for (var i = start; i <= end - fretSpan + 1; i++)
			{
				var newVariations = GenerateVariations(@base, tuning, i, fretSpan);

				for (var j = 0; j < newVariations.Count; j++)
				{
					var varString = variationString(newVariations[j]);
					if (!variationStrings.Contains(varString))
					{
						variations.Add(newVariations[j]);
						variationStrings.Add(varString);
					}
				}
			}

			return variations;
		}

		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

		#region Private Methods

		private string variationString(ScaleVariation variation)
		{
			return string.Join("", variation.Positions.Select(o => string.Join("", o.Select(p => p == null ? "0" : p.ToString()))));
		}

		private ScaleDegree calcNextDegree(Scale scale, int currentDegree)
		{
			// TODO: ScaleDegree is non-zero based. Should it be?
			var nextDegree = (ScaleDegree)((currentDegree + 1) % (scale.Notes.Count + 1));
			if (nextDegree == 0) nextDegree++;

			return nextDegree;
		}

		// Works under the assumption that variations always directly follow
		//	a scale's notes (from tonic to tonic)
		private int calcNextOctave(Scale scale, Note note)
		{
			var currentOctave = (int)note.Octave;
			var index = scale.Notes.FindIndex(n => Notes.Equals(note, n));

			return index == scale.Notes.Count - 1 ? currentOctave + 1 : currentOctave;
		}

		private List<List<Note>> mapScaleNotes(Scale scale, Tuning tuning, int offset, int span)
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
						var octave = (int)o.Octave + (o.Pitch + p) / Notes.Count;

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

		private List<List<List<ScaleDirection>>> otherSide(List<List<ScaleDirection>> directions, List<List<Note>> positions, Scale scale, Tuning tuning, int offset, int span, int oStart = 0, int pStart = 0)
		{
			var directionsList = new List<List<List<ScaleDirection>>>();

			for (var o = oStart; o < positions.Count; o++)
			{
				directions.Add(new List<ScaleDirection>());
				for (var p = pStart; p < span; p++)
				{
					ScaleDirection nextDirection = ScaleDirection.Null;

					var note = positions[o][p];
					if (note != null)
					{
						nextDirection = ScaleDirection.End;

						var nextDegree = calcNextDegree(scale, (int)note.Degree);
						var nextOctave = calcNextOctave(scale, note);
						//var nextOctave = tuning.Offsets[o].Octave + (tuning.Offsets[o].Pitch + offset + p) / Notes.Count;

						// Next note on current string
						var currentStringIndex = positions[o].FindIndex(p, n => n != null && n.Degree == nextDegree && n.Octave == nextOctave);
						if (currentStringIndex > -1)
						{
							Debug.WriteLine($"{nextOctave} {note.Octave} {positions[o][currentStringIndex].Octave}");
							nextDirection = ScaleDirection.NextFret;
						}

						// First note on next string
						if (o < positions.Count - 1)
						{
							var nextStringIndex = positions[o + 1].FindIndex(n => n != null && n.Degree == nextDegree && n.Octave == nextOctave);
							if (nextStringIndex > -1)
							{
								if (nextDirection == ScaleDirection.NextFret)
								{
									var directionsDup = directions.Select(o => o.Select(p => p).ToList()).ToList();

									while (directionsDup[o].Count < positions[o].Count)
										directionsDup[o].Add(ScaleDirection.Null);

									directionsList.AddRange(otherSide(directionsDup, positions, scale, tuning, offset, span, o + 1, 0));
								}
							}
						}
					}

					directions[o].Add(nextDirection);

					// Break position loop. Continue offset loop
					if (nextDirection == ScaleDirection.NextString ||
						nextDirection == ScaleDirection.End) break;
				}
			}

			directionsList.Add(directions);

			return directionsList;
		}

		private List<ScaleVariation> itDependsOnThePuppet(Scale scale, Tuning tuning, int offset, List<List<List<ScaleDirection>>> directions, List<List<Note>> scaleNotes)
		{
			var variations = directions.Select(v =>
			{
				var positions = v.Select((offsetList, offsetIndex) =>
				{
					Note prevNote = null;
					return offsetList.Select((posList, posIndex) =>
					{
						var direction = v[offsetIndex][posIndex];

						Note note = null;
						if (direction != ScaleDirection.Null)
						{
							var current = scaleNotes[offsetIndex][posIndex];

							var nextOctave = tuning.Offsets[offsetIndex].Octave + (tuning.Offsets[offsetIndex].Pitch + offset + posIndex) / Notes.Count;

							if (prevNote == null ||
								(current.Degree == calcNextDegree(scale, (int)prevNote?.Degree) && current.Octave == nextOctave))
							{
								note = current;
								prevNote = note;
							}
						}

						return note != null ? (int?)note.Degree : null;
					}).ToList();
				}).ToList();

				return new ScaleVariation(scale, tuning.Id, offset, positions);
			}).ToList();

			return variations;
		}

		private List<ScaleVariation> calcVariationPositions(Scale scale, Tuning tuning, int offset, List<List<ScaleDirection>> scaleDirections, List<List<Note>> scalePositions, List<List<Note>> variationPositions, int oStart = 0, int pStart = 0, Note prevNote = null)
		{
			var variations = new List<ScaleVariation>();
			var tonics = new List<ScalePosition>();

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

						if (current.Degree == ScaleDegree.Tonic)
						{
							tonics.Add(new ScalePosition() { String = o, Fret = p });
						}

						var nextOctave = tuning.Offsets[o].Octave + (tuning.Offsets[o].Pitch + offset + p) / Notes.Count;

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

						variations.AddRange(calcVariationPositions(scale, tuning, offset, scaleDirections, scalePositions, positionsDup, o + 1, 0, prevDup));
					}
				}

				while (notes.Count < scalePositions[o].Count)
					notes.Add(null);

				variationPositions.Add(notes);
			}

			// Map notes to lists of degrees & clean up
			var positions = variationPositions.Select(s => s.Select(f => (int?)f?.Degree).ToList()).ToList();

			var variation = new ScaleVariation(scale, tuning.Id, offset, positions);
			variation.Tonics = tonics;

			if (positions.All(o => o[0] == null))
			{
				positions.ForEach(o =>
				{
					o.RemoveAt(0);
				});

				variation.Offset++;
			}

			if (positions.All(o => o.Last() == null))
			{
				positions.ForEach(o =>
				{
					o.RemoveAt(o.Count - 1);
				});
			}


			variations.Add(variation);

			return variations;
		}

		#endregion

	}
}
