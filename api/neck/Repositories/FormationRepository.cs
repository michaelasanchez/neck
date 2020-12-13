using Microsoft.EntityFrameworkCore;
using neck.Models;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class FormationRepository : GenericRepository<Formation>
	{
		public FormationRepository(NeckContext context)
			: base(context)
		{
		}

		public async override Task<OperationResult<Formation>> Get(Formation formation)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(f => f.Positions == formation.Positions);
			return BuildGetOperationResult(result);
		}

	}
}
