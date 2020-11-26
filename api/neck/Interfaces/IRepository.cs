using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IRepository<T> //: IDisposable
    {
        public Task<T> Get(Guid? id);

        public Task<IEnumerable<T>> GetAll();

        public Task<T> FirstOrDefault(Expression<Func<T, bool>> predicate);

        public Task<OperationResult<int>> Insert(T entity);

        public Task<OperationResult<int>> Delete(T entity);

        public Task<OperationResult<int>> Update(T entity);

        public Task<OperationResult<int>> Save();

        public Task<T> Exists(T entity);

        public Task<int> Count();
    }
}
