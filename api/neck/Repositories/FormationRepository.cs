using neck.Models;

namespace neck.Repositories
{
	public class FormationRepository : GenericRepository<Formation>
    {
        public FormationRepository(NeckContext context)
            : base(context)
		{
		}
    }
}
