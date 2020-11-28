using Microsoft.EntityFrameworkCore;
using neck.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class ChordRepository : GenericRepository<Chord>
	{
		public ChordRepository(NeckContext context)
			: base(context)
		{
		}

		public override IQueryable<Chord> DefaultIncludes()
		{
			return _queryable.Include(c => c.Root);
		}

		public override Task<Chord> Exists(Chord chord)
		{
			var result = DefaultIncludes()
				.FirstOrDefault(c => c.Root.Base == chord.Root.Base
					&& c.Root.Suffix == chord.Root.Suffix
					&& c.Modifier == chord.Modifier);

			return Task.FromResult(result);
		}

	}
}
