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

        //public Task<T> FirstOrDefault(Expression<Func<T, bool>> predicate);

        public Task<IEnumerable<T>> GetAll();

        public Task Insert(T entity);

        public Task Delete(T entity);

        public Task Update(T entity);

        public Task<int> Count();
    }
}
