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
	public class ChordController : GenericController<Chord>
	{
		public ChordController(IRepository<Chord> repository)
			: base(repository)
		{
		}
	}
}
