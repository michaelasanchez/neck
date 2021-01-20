using neck.Enums;
using neck.Interfaces;
using neck.Models;
using neck.Models.Variations;
using System.Collections.Generic;
using System.Linq;

namespace neck.Factories
{
	public class ScaleVariationFactory : IVariationFactory<Scale, ScaleVariation>
	{

		public List<ScaleVariation> GenerateVariations(Scale @base, Tuning tuning, int offset, int span)
		{
			Scale scale = @base;

			var noteSpan = mapNoteSpan(scale, tuning, offset, span);
			var positions = generateDegreePositions(noteSpan, scale, offset, span, new List<List<ScaleDegree?>>());

			return positions.Select(p => new ScaleVariation(scale, tuning.Id, offset, p)).ToList();
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

		private ScaleDegree calcNextDegree(Scale scale, Note note)
		{
			// TODO: ScaleDegree is non-zero based. Should it be?
			var nextDegree = (ScaleDegree)(((int)note.Degree + 1) % (scale.Notes.Count + 1));
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
						var copy = note.Copy();
						copy.Octave = (int)o.Octave + (o.Pitch + p) / Notes.Count;

						frets[p - offset] = copy;
					}
				}

				strings.Add(frets);
			};

			return strings;
		}

		private List<List<List<ScaleDegree?>>> generateDegreePositions(List<List<Note>> noteSpan, Scale scale, int offset, int span, List<List<ScaleDegree?>> degrees = null, Note prevNote = null, int oStart = 0, int pStart = 0)
		{
			var positions = new List<List<List<ScaleDegree?>>>();

			for (var o = oStart; o < noteSpan.Count; o++)
			{
				var currentDegrees = new List<ScaleDegree?>();
				for (var p = pStart; p < span; p++)
				{
					ScaleDegree? currentDegree = null;

					// Validate next note
					var note = noteSpan[o][p];
					if (note != null && (prevNote == null ||
						(note.Degree == calcNextDegree(scale, prevNote) && note.Octave == calcNextOctave(scale, prevNote))))
					{
						prevNote = note;
						currentDegree = note.Degree;

						var nextDegree = calcNextDegree(scale, note);
						var nextOctave = calcNextOctave(scale, note);

						// Next note on current string
						var currentStringIndex = noteSpan[o].FindIndex(p, n => n != null && n.Degree == nextDegree && n.Octave == nextOctave);
						if (currentStringIndex > -1)
						{
							// First note on next string
							if (o < noteSpan.Count - 1)
							{
								var nextStringIndex = noteSpan[o + 1].FindIndex(n => n != null && n.Degree == nextDegree && n.Octave == nextOctave);
								if (nextStringIndex > -1)
								{
									var currentDup = currentDegrees.Select(d => d).ToList();
									currentDup.Add(note.Degree);

									while (currentDup.Count < span)
										currentDup.Add(null);

									var directionsDup = degrees.Select(o => o.Select(p => p).ToList()).ToList();
									directionsDup.Add(currentDup);

									positions.AddRange(generateDegreePositions(noteSpan, scale, offset, span, directionsDup, prevNote.Copy(), o + 1, 0));
								}
							}
							else
							{
								// TODO: Handle case where scale has ended
							}
						}
					}

					currentDegrees.Add(currentDegree);
				}

				while (currentDegrees.Count < span)
					currentDegrees.Add(null);

				degrees.Add(currentDegrees);
			}

			positions.Add(degrees);

			return positions;
		}
		#endregion

	}
}
