using Microsoft.EntityFrameworkCore;
using neck.Interfaces;
using neck.Models;
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

        public virtual async Task<IEnumerable<TEntity>> GetAll() => await _set.ToListAsync();

        public virtual async Task<TEntity> Get(Guid? id) => await _set.FirstOrDefaultAsync(z => z.Id == id);

        public virtual IQueryable<TEntity> GetWhere(Expression<Func<TEntity, bool>> predicate) => _set.Where(predicate);

        public virtual async Task Insert(TEntity entity)
        {
            await _set.AddAsync(entity);
            await _context.SaveChangesAsync();

            Debug.WriteLine(entity.ToString());
        }

        public virtual Task Update(TEntity entity) {
            _context.Entry(entity).State = EntityState.Modified;
            return _context.SaveChangesAsync();
        }

        public virtual Task Delete(TEntity entity)
        {
            _set.Remove(entity);
            return _context.SaveChangesAsync();
        }

        public virtual async Task<int> Count() => await _set.CountAsync();

        // TODO: why bool?
        //public async Task<int> Count(Expression<Func<TEntity, bool>> predicate) => await _set.CountAsync(predicate);
    }
}
