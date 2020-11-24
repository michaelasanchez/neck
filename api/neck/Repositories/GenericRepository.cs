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

        public virtual TEntity FirstOrDefault(Expression<Func<TEntity, bool>> predicate) => _set.FirstOrDefault(predicate);

        public virtual async Task<int> Insert(TEntity entity)
        {
            await _set.AddAsync(entity);
            return await Save();
        }

        public virtual async Task<int> Update(TEntity entity) {
            _context.Entry(entity).State = EntityState.Modified;
            return await Save();
        }

        public virtual async Task<int> Delete(TEntity entity)
        {
            _set.Remove(entity);
            return await Save();
        }

        public virtual async Task<int> Save()
        {
            int result;
            try
            {
                result = await _context.SaveChangesAsync();
            } catch (Exception ex)
			{
                Debug.WriteLine(ex.ToString());
                return 0;
			}

            return result;
        }

        public virtual async Task<int> Count() => await _set.CountAsync();

        // TODO: why bool?
        //public async Task<int> Count(Expression<Func<TEntity, bool>> predicate) => await _set.CountAsync(predicate);
    }
}
