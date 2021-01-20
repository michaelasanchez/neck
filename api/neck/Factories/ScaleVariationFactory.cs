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

			var scaleNotes = mapScaleNotes(scale, tuning, offset, span);
			var variationDirections = generateVariationDirection(new List<List<ScaleDirection>>(), scaleNotes, scale, offset, span);
			var scaleVariations = mapScaleVariations(scale, tuning, offset, variationDirections, scaleNotes);

			return scaleVariations;
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

		private List<List<List<ScaleDirection>>> generateVariationDirection(List<List<ScaleDirection>> directions, List<List<Note>> positions, Scale scale, int offset, int span, int oStart = 0, int pStart = 0, Note prevNote = null)
		{
			var directionsList = new List<List<List<ScaleDirection>>>();

			for (var o = oStart; o < positions.Count; o++)
			{
				var currentDirections = new List<ScaleDirection>();
				for (var p = pStart; p < span; p++)
				{
					ScaleDirection nextDirection = ScaleDirection.Null;

					var note = positions[o][p];
					if (note != null && (prevNote == null ||
						(note.Degree == calcNextDegree(scale, (int)prevNote.Degree) && note.Octave == calcNextOctave(scale, prevNote))))
					{
						nextDirection = ScaleDirection.End;
						prevNote = note;

						var nextDegree = calcNextDegree(scale, (int)note.Degree);
						var nextOctave = calcNextOctave(scale, note);

						// Next note on current string
						var currentStringIndex = positions[o].FindIndex(p, n => n != null && n.Degree == nextDegree && n.Octave == nextOctave);
						if (currentStringIndex > -1)
						{
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
									// TODO: Look into less manually way of doing this
									var currentDup = currentDirections.Select(d => d).ToList();
									currentDup.Add(ScaleDirection.NextString);

									while (currentDup.Count < span)
										currentDup.Add(ScaleDirection.Null);

									var directionsDup = directions.Select(o => o.Select(p => p).ToList()).ToList();
									directionsDup.Add(currentDup);

									directionsList.AddRange(generateVariationDirection(directionsDup, positions, scale, offset, span, o + 1, 0, prevNote.Copy()));
								}

								nextDirection = ScaleDirection.NextString;
							}
						}
					}

					currentDirections.Add(nextDirection);
				}

				while (currentDirections.Count < span)
					currentDirections.Add(ScaleDirection.Null);

				directions.Add(currentDirections);
			}

			directionsList.Add(directions);

			return directionsList;
		}

		private List<ScaleVariation> mapScaleVariations(Scale scale, Tuning tuning, int offset, List<List<List<ScaleDirection>>> directions, List<List<Note>> scaleNotes)
		{
			var variations = directions.Select(v =>
			{
				var positions = v.Select((offsetList, offsetIndex) =>
				{
					return offsetList.Select((posList, posIndex) =>
					{
						var direction = v[offsetIndex][posIndex];

						Note note = null;
						if (direction != ScaleDirection.Null)
						{
							note = scaleNotes[offsetIndex][posIndex];
						}

						return note != null ? (int?)note.Degree : null;
					}).ToList();
				}).ToList();

				return new ScaleVariation(scale, tuning.Id, offset, positions);
			}).ToList();

			return variations;
		}
		#endregion

	}
}
