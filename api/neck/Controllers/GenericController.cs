using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public class GenericController<T> : ControllerBase, IController<T>
	{
		protected IRepository<T> _repository;

		public GenericController(IRepository<T> repository)
		{
			_repository = repository;
		}

		[HttpGet("all")]
		public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
		{
			var result = await _repository.GetAll();
			if (!result.Success)
			{
				return BadRequest(new { message = result.Message });
			}

			return Ok(result.Result);
		}

		[HttpPost]
		public virtual async Task<IActionResult> Create(T entity)
		{
			var result = await _repository.Create(entity);

			return result.Success ? Ok(result.Result) : BadRequest(new { message = result.Message });
		}

		[HttpGet("{id:Guid}")]
		public virtual async Task<ActionResult<T>> GetById(Guid id)
		{
			var result = await _repository.GetById(id);
			if (!result.Success)
			{
				return NotFound(new { message = result.Message });
			}

			return Ok(result.Result);
		}

		[HttpPatch]
		public async Task<ActionResult<T>> Update(T entity)
		{
			var result = await _repository.Update(entity);

			return Ok(result.Result);
		}

		[HttpDelete]
		public virtual async Task<IActionResult> Delete(T entity) => Ok(await _repository.Delete(entity));
	}
}