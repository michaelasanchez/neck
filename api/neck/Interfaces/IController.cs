using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IController<T>
    {
        public Task<List<T>> Get();

        public Task Insert(T entity);
    }
}
