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
		public async Task<List<T>> Get() => (List<T>)await _repository.GetAll();

		[HttpPost]
		public async Task Insert(T entity) => await _repository.Insert(entity);

		//[HttpPatch]
		//public async Task Update(T entity) => await _repository.Update(entity);

		[HttpDelete]
		public async Task Delete(T entity) => await _repository.Delete(entity);
	}
}