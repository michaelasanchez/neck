using Microsoft.EntityFrameworkCore;
using neck.Interfaces;
using neck.Models.Db;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace neck.Repositories
{
    public class GenericRepository<TEntity> : IRepository<TEntity>
        where TEntity : class, IDbEntity
    {
        private NeckContext _context;

        private DbSet<TEntity> _set;

        public GenericRepository(NeckContext context)
        {
            _context = context;
            _set = _context.Set<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> GetAll() => await _set.ToListAsync();

        public async Task<TEntity> Get(Guid? id) => await _set.FirstOrDefaultAsync(z => z.Id == id);

        public async Task Insert(TEntity entity)
        {
            await _set.AddAsync(entity);
            await _context.SaveChangesAsync();

            Debug.WriteLine(entity.ToString());
        }

        public Task Update(TEntity entity) {
            _context.Entry(entity).State = EntityState.Modified;
            return _context.SaveChangesAsync();
        }

        public Task Delete(TEntity entity)
        {
            _set.Remove(entity);
            return _context.SaveChangesAsync();
        }

        public async Task<int> Count() => await _set.CountAsync();

        // TODO: why bool?
        //public async Task<int> Count(Expression<Func<TEntity, bool>> predicate) => await _set.CountAsync(predicate);
    }
}
