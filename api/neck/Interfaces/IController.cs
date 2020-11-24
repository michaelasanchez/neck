using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IController<T>
    {
        public Task<ActionResult<IEnumerable<T>>> Get();

		public Task<IActionResult> Insert(T entity);

        //public Task Update(T entity);

        public Task<IActionResult> Delete(T entity);
	}
}
