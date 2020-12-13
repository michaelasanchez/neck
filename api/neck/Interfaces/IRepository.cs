using neck.Models;
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

		public Task<OperationResult<T>> GetByIdAsync(Guid? id);

        public Task<OperationResult<IEnumerable<T>>> GetAll();

        public Task<OperationResult<T>> GetOrCreate(T entity);

        public Task<OperationResult<int>> Create(T entity);

        public Task<OperationResult<int>> Delete(T entity);

        public Task<OperationResult<int>> Update(T entity);

        public Task<OperationResult<int>> Save();

        public Task<int> Count(Expression<Func<T, bool>> predicate);
    }
}
