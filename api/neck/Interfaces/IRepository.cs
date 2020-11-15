using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    interface IRepository<IDbEntity> : IDisposable
    {
        IEnumerable<IDbEntity> Get();

        IDbEntity Get(Guid id);

        void Insert(IDbEntity entity);

        void Delete(IDbEntity entity);

        void Update(IDbEntity entity);

        void Save();
    }
}
