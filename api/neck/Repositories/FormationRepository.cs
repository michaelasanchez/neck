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

		public override Task<Formation> Exists(Formation formation)
		{
			return FirstOrDefaultAsync(f => f.Positions == formation.Positions);
		}

	}
}
