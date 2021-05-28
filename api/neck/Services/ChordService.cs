using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Args;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static neck.Enums.ChordEnums;

namespace neck.Services
{
	public class ChordService : IChordService
	{
		private Lazy<IRepository<Note>> _noteRepo;

		public ChordService(IRepository<Note> noteRepository)
		{
			_noteRepo = new Lazy<IRepository<Note>>(noteRepository);
		}

		public async Task<OperationResult<List<Chord>>> Search(SearchArgs args)
		{
			var modifierValues = Enum.GetValues(typeof(ChordModifier)) as ChordModifier[];

			var rootsQuery = await _noteRepo.Value.GetAll();

			var chordMatches = new List<Chord>();

			foreach (var rootNote in rootsQuery.Result)
			{
				foreach (var modifier in modifierValues)
				{
					try
					{
						var chord = new Chord(rootNote, modifier);

						if (chord.Tones.Any(c => c ==null))
						{
							;
						}

						// TODO: We shouldn't need null checks here. Somthing with diminished
						if (args.Notes.All(t =>
						{
							return chord.Tones.Any(s =>
							{
								return s?.Pitch == t?.Pitch;
							});
						}))
						{
							chordMatches.Add(chord);
						}
					}

					catch
					{

					}
				}
			}

			return OperationResult<List<Chord>>.CreateSuccess(chordMatches);
		}
	}
}
