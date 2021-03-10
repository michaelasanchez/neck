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

		[HttpGet("byinstrument/{instrumentId:Guid}")]
		public virtual async Task<ActionResult<List<Tuning>>> GetByInstrument(Guid instrumentId)
		{
			var result = await _repository.GetBy(t => t.InstrumentId == instrumentId);
			if (!result.Success)
			{
				return NotFound(new { message = result.Message });
			}

			return Ok(result.Result);
		}
	}
}
