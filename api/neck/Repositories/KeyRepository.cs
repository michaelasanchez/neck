using Microsoft.EntityFrameworkCore;
using neck.Models;
using neck.Models.Entity;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
    public class KeyRepository : GenericRepository<Key>
	{
		public KeyRepository(NeckContext context)
			: base(context)
		{
		}

		public async override Task<OperationResult<Key>> Get(Key key)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(n => n.Type == key.Type && n.TonicId == key.TonicId);
			return BuildGetOperationResult(result);
		}
	}
}
