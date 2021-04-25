using Microsoft.AspNetCore.Mvc;
using neck.Interfaces;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public class EntityController<TEntity> : ControllerBase, IController<TEntity>
		where TEntity : IDbEntity
	{
		protected IRepository<TEntity> _repository { get; set; }

		public EntityController(IRepository<TEntity> repository)
		{
			_repository = repository;
		}

		[HttpGet("all")]
		public virtual async Task<ActionResult<IEnumerable<TEntity>>> GetAll()
		{
			var getAllResult = await _repository.GetAll();
			if (!getAllResult.Success)
			{
				return BadRequest(new Response<IEnumerable<TEntity>>(getAllResult));
			}

			return Ok(getAllResult.Result);
		}

		[HttpPost]
		public virtual async Task<IActionResult> Create(TEntity entity)
		{
			var createResult = await _repository.Create(entity);

			return createResult.Success
				? Ok(createResult.Result)
				: Conflict(new Response<TEntity>(createResult));
		}

		[HttpGet("{id:Guid}")]
		public virtual async Task<ActionResult<TEntity>> GetById(Guid id)
		{
			var getResult = await _repository.GetById(id);
			if (!getResult.Success)
			{
				return NotFound(new Response<TEntity>(getResult));
			}

			return Ok(getResult.Result);
		}

		[HttpPatch]
		public async Task<ActionResult<TEntity>> Update(TEntity entity)
		{
			var updateResult = await _repository.Update(entity);
			if (!updateResult.Success)
			{
				return BadRequest(new Response<TEntity>(updateResult));
			}

			return Ok(updateResult.Result);
		}

		[HttpDelete]
		public virtual async Task<IActionResult> Delete(TEntity entity) => Ok(await _repository.Delete(entity));
	}
}