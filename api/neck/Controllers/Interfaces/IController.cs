using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers.Interfaces
{
	public interface IController<T>
	{
		public Task<ActionResult<IEnumerable<T>>> GetAll();

		public Task<ActionResult<T>> GetById(Guid id);

		public Task<ActionResult<T>> Create(T entity);

		public Task<ActionResult<T>> Update(T entity);

		public Task<IActionResult> Delete(T entity);
	}
}
