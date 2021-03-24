using Microsoft.EntityFrameworkCore;
using neck.Models;
using neck.Models.Results;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class TuningRepository : GenericRepository<Tuning>
	{
		public TuningRepository(NeckContext context)
			: base(context)
		{
		}

		public async override Task<OperationResult<Tuning>> Get(Tuning tuning)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(t => t.InstrumentId == tuning.InstrumentId && t.Offsets == tuning.Offsets);
			return BuildGetOperationResult(result);
		}

	}
}
