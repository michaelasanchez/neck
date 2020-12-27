using Microsoft.EntityFrameworkCore.ChangeTracking;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IRepository<T>
    {
		public Task<OperationResult<T>> Get(T entity);

		public Task<OperationResult<T>> GetById(Guid? id);

        public Task<OperationResult<IEnumerable<T>>> GetAll();

        public Task<OperationResult<T>> GetOrCreate(T entity);

        public Task<OperationResult<T>> Create(T entity);

        public Task<OperationResult<T>> Update(T entity);

        public Task<OperationResult<T>> Delete(T entity);

        public Task<int> Count(Expression<Func<T, bool>> predicate);
    }
}
