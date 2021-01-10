using Microsoft.EntityFrameworkCore;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class ScaleRepository : GenericRepository<Scale>
	{
		public ScaleRepository(NeckContext context)
			: base(context)
		{
			GetAllDefaultIncludes = true;
		}

		public override IQueryable<Scale> DefaultIncludes()
		{
			return _set.AsQueryable().Include(s => s.Root);
		}

		public async override Task<OperationResult<Scale>> Get(Scale scale)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(s => s.Type == scale.Type
					&& s.Root.Base == scale.Root.Base
					&& s.Root.Suffix == scale.Root.Suffix);

			return BuildGetOperationResult(result);
		}

	}
}
