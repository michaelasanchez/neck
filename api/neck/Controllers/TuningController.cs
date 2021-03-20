using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
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
			var tuningsResult = await _repository.GetBy(t => t.InstrumentId == instrumentId);
			if (!tuningsResult.Success)
			{
				return NotFound(new Response<IEnumerable<Tuning>>(tuningsResult));
			}

			return Ok(tuningsResult.Result);
		}
	}
}
