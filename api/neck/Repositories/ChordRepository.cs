using Microsoft.EntityFrameworkCore;
using neck.Interfaces;
using neck.Models;
using neck.Models.Entity;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
    public class ChordRepository : GenericRepository<Chord>
	{
		private Lazy<IRepository<Note>> _noteRepo;

		public ChordRepository(NeckContext context, IRepository<Note> noteRepo)
			: base(context)
		{
			_noteRepo = new Lazy<IRepository<Note>>(noteRepo);

			GetAllDefaultIncludes = true;
		}

		public override IQueryable<Chord> DefaultIncludes()
		{
			return _set.AsQueryable().Include(c => c.Root);
		}

		public override async Task<OperationResult<Chord>> Get(Chord chord)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(c => c.Root.Base == chord.Root.Base
					&& c.Root.Suffix == chord.Root.Suffix
					&& c.Modifier == chord.Modifier);

			return BuildGetOperationResult(result);
		}

		public override async Task<OperationResult<Chord>> Create(Chord chord)
		{
			if (chord?.Root?.Id == null)
			{
				var noteResult = await _noteRepo.Value.Get(chord.Root);
				if (!noteResult.Success)
				{
					return OperationResult<Chord>.CreateFailure($"Failed to create Note:\n {noteResult.Message}");
				}

				chord.Root = noteResult.Result;
			}

			return await base.Create(chord);
		}

	}
}
