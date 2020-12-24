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
		public ScaleVariation GenerateVariations(Scale scale, Tuning tuning, int offset, int span)
		{
			var variation = new ScaleVariation();
			var positions = new List<List<Note>>();

			foreach (var o in tuning.Offsets)
			{

				// BROKEN
				var frets = Enumerable.Repeat<Note>(null, span).ToList();

				// GOTTA FIGURE OUT HOW TO INSTANTIATE A LIST OF NULLS !!

				foreach (var n in scale.Notes)
				{
					var mappedFret = Notes.Normalize(n.Pitch - o);
					if (mappedFret < frets.Count)
					{
						frets[mappedFret] = n;
					}
				}
				positions.Add(frets);
			};

			var end = false;
			int s = 0, f = 0;

			variation.Positions = new List<List<Note>>();
			for (var i = 0; i < tuning.Offsets.Count; i++) {
				variation.Positions.Add(new List<Note>());
			}

			while (!end)
			{
				var note = positions[s][f];
				variation.Positions[s].Add(note);

				if (note != null)
				{
					if (s < tuning.Offsets.Count - 1)
					{
						var nextStringFretIndex = positions[s + 1].FindIndex(n => n != null);
						if (positions[s + 1][nextStringFretIndex].Degree == (ScaleDegree)(((int)note.Degree + 1) % 8))
						{
							s++;
							f = 0;
						}
						else
						{
							if (f < span - 1)
							{
								f++;
							}
							else if (s < tuning.Offsets.Count - 1)
							{
								s++;
								f = 0;
							} else
							{
								end = true;
							}
						}
					}
					else if (f < span - 1)
					{
						f++;
					}
					else
					{
						end = true;
					}
				}
				else if (f < span - 1)
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

		private Tuple<int, int> incrementPosition(Tuple<int, int> stringFret, int span, int offsets)
		{
			var s = stringFret.Item1;
			var f = stringFret.Item2;

			if (f < span - 1)
			{
				return new Tuple<int, int>(s, f++);
				f++;
			}
			else if (s < offsets)
			{
				return new Tuple<int, int>(s++, 0);
			}
			else
			{
				return null;
			}
		}

		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

	}
}
