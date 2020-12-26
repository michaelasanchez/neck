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
		private List<List<Note>> mapFrets(Scale scale, Tuning tuning)
		{
			var strings = new List<List<Note>>();
			foreach (var o in tuning.Offsets)
			{
				var frets = Enumerable.Repeat<Note>(null, Notes.Count).ToList();
				foreach (var n in scale.Notes)
				{
					var mappedFret = Notes.Normalize(n.Pitch - o);
					if (mappedFret < frets.Count)
					{
						frets[mappedFret] = n;
					}
				}
				strings.Add(frets);
			};

			return strings;
		}

		private List<List<Note>> initPositions(int numOffsets)
		{
			var positions = new List<List<Note>>();
			for (var i = 0; i < numOffsets; i++)
			{
				positions.Add(new List<Note>());
			}
			return positions;
		}

		public ScaleVariation GenerateVariations(Scale scale, Tuning tuning, int offset, int span)
		{
			var variation = new ScaleVariation();
			var positions = mapFrets(scale, tuning);

			variation.Positions = initPositions(tuning.Offsets.Count);

			var end = false;
			int s = 0, f = 0;

			while (!end)
			{
				var note = positions[s][f];
				variation.Positions[s].Add(note);

				if (note != null && s < tuning.Offsets.Count - 1)
				{
					var nextFretIndex = positions[s + 1].FindIndex(n => n != null);
					var nextDegree = (ScaleDegree)(((int)note.Degree + 1) % (scale.Notes.Count + 1));

					if (positions[s + 1][nextFretIndex].Degree == nextDegree)
					{
						s++;
						f = 0;
						continue;
					}
				}

				if (f < span - 1)
				{
					f++;
				}
				else if (s < tuning.Offsets.Count - 1)
				{
					s++;
					f = 0;
				}
				else
				{
					end = true;
				}
			}

			return variation;
		}

		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

	}
}
