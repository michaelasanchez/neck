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

		public T FirstOrDefault(Expression<Func<T, bool>> predicate);

		public Task<IEnumerable<T>> GetAll();

        public Task<int> Insert(T entity);

        public Task<int> Delete(T entity);

        public Task<int> Update(T entity);

        public Task<int> Save();

        public Task<int> Count();
    }
}
