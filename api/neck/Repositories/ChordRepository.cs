using Microsoft.EntityFrameworkCore;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class ChordRepository : GenericRepository<Chord>
	{
		public ChordRepository(NeckContext context)
			: base(context)
		{
			GetAllDefaultIncludes = true;
		}

		public override IQueryable<Chord> DefaultIncludes()
		{
			return _set.AsQueryable().Include(c => c.Root);
		}

		public async override Task<OperationResult<Chord>> Get(Chord chord)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(c => c.Root.Base == chord.Root.Base
					&& c.Root.Suffix == chord.Root.Suffix
					&& c.Modifier == chord.Modifier);

			return BuildGetOperationResult(result);
		}

	}
}
