using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public class TuningController : GenericController<Tuning>
	{
		public TuningController(IRepository<Tuning> repository)
			: base(repository)
		{
		}
	}
}
