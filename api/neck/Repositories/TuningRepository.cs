using Microsoft.EntityFrameworkCore;
using neck.Models;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class TuningRepository : GenericRepository<Tuning>
	{
		public TuningRepository(NeckContext context)
			: base(context)
		{
		}

		public override Task<Tuning> Exists(Tuning tuning)
		{
			var result = _queryable.FirstOrDefault(t => t.Offsets == tuning.Offsets);
			return Task.FromResult(result);
		}

	}
}
