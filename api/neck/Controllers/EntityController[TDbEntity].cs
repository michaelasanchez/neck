using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public class EntityController<T> : ControllerBase, IController<T>
		where T : IDbEntity
	{
		protected IRepository<T> _repository;

		public EntityController(IRepository<T> repository)
		{
			_repository = repository;
		}

		[HttpGet("all")]
		public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
		{
			var getAllResult = await _repository.GetAll();
			if (!getAllResult.Success)
			{
				return BadRequest(new Response<IEnumerable<T>>(getAllResult));
			}

			return Ok(getAllResult.Result);
		}

		[HttpPost]
		public virtual async Task<IActionResult> Create(T entity)
		{
			var createResult = await _repository.Create(entity);

			return createResult.Success
				? Ok(createResult.Result)
				: Conflict(new Response<T>(createResult));
		}

		[HttpGet("{id:Guid}")]
		public virtual async Task<ActionResult<T>> GetById(Guid id)
		{
			var getResult = await _repository.GetById(id);
			if (!getResult.Success)
			{
				return NotFound(new Response<T>(getResult));
			}

			return Ok(getResult.Result);
		}

		[HttpPatch]
		public async Task<ActionResult<T>> Update(T entity)
		{
			var updateResult = await _repository.Update(entity);
			if (!updateResult.Success)
			{
				return BadRequest(new Response<T>(updateResult));
			}

			return Ok(updateResult.Result);
		}

		[HttpDelete]
		public virtual async Task<IActionResult> Delete(T entity) => Ok(await _repository.Delete(entity));
	}
}