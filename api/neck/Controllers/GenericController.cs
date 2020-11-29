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
		public virtual async Task<ActionResult<IEnumerable<T>>> GetAll() => Ok(await _repository.GetAll());

		[HttpGet("{id:Guid}")]
		public virtual async Task<ActionResult<T>> GetById(Guid id)
		{
			var result = await _repository.GetByIdAsync(id);
			if (result == null)
			{
				return NotFound();
			}

			return Ok(result);
		}

		[HttpPost]
		public virtual async Task<IActionResult> Insert(T entity)
		{
			var result = await _repository.Insert(entity);

			return result.Success ? Ok("All good") : BadRequest(result.Message);
		}

		//[HttpPatch]
		//public async Task Update(T entity) => await _repository.Update(entity);

		[HttpDelete]
		public virtual async Task<IActionResult> Delete(T entity) => Ok(await _repository.Delete(entity));
	}
}