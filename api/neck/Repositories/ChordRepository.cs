using Microsoft.EntityFrameworkCore;
using neck.Models;
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

		public override Task<Chord> Exists(Chord chord)
		{
			//var test = _set.FirstOrDefault(c => c.Root.Id == chord.Root.Id && c.Modifier == chord.Modifier).Include()

			//var who = await GetQueryable();
			//who.Include
			//var test = _set.AsQueryable()
			//	.Include(c => c.Root)
			//	.FirstOrDefault(c => c.Root.Id == chord.Root.Id && c.Modifier == chord.Modifier);

			//.FirstOrDefault(c => c.Root.Id == chord.Root.Id && c.Modifier == chord.Modifier)
			var result = _queryable
				.Include(c => c.Root)
				.FirstOrDefault(c => c.Root.Base == chord.Root.Base && c.Root.Suffix == chord.Root.Suffix && c.Modifier == chord.Modifier);

			return Task.FromResult(result);
			// WORKS
			//_set.FirstOrDefault(c => chord.Root.Id == chord.Root.Id);
			//return await FirstOrDefault(c => c.Root.Id == chord.Root.Id && c.Modifier == chord.Modifier);
		}

	}
}
