using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class TuningController : GenericController<Tuning>
	{
		public TuningController(IRepository<Tuning> repository)
			: base(repository)
		{
		}
	}
}
