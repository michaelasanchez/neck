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

		[HttpGet]
		public virtual async Task<ActionResult<IEnumerable<T>>> Get() => Ok(await _repository.GetAll());

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