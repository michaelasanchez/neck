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
    public class ScaleRepository : GenericRepository<Scale>
	{
		private Lazy<IRepository<Note>> _noteRepo;

		public ScaleRepository(NeckContext context, IRepository<Note> noteRepo)
			: base(context)
		{
			_noteRepo = new Lazy<IRepository<Note>>(noteRepo);

			GetAllDefaultIncludes = true;
		}

		public override IQueryable<Scale> DefaultIncludes()
		{
			return _set.AsQueryable().Include(s => s.Tonic);
		}

		public override async Task<OperationResult<Scale>> Get(Scale scale)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(s => s.Type == scale.Type
					&& s.Tonic.Base == scale.Tonic.Base
					&& s.Tonic.Suffix == scale.Tonic.Suffix);

			return BuildGetOperationResult(result);
		}

		public override async Task<OperationResult<Scale>> Create(Scale scale)
		{
			if (scale.Tonic?.Id == null || scale.Tonic.Id == Guid.Empty)
			{
				var noteResult = await _noteRepo.Value.Get(scale.Tonic);
				if (noteResult.Success)
				{
					scale.Tonic = noteResult.Result;
				}
			}

			return await base.Create(scale);
		}

	}
}
