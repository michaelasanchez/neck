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

		protected DbSet<TEntity> _set;

		protected IQueryable<TEntity> _queryable;

		public GenericRepository(NeckContext context)
		{
			_context = context;
			_set = _context.Set<TEntity>();
			_queryable = _set.AsQueryable();
		}

		public virtual Task<TEntity> Get(Guid? id)
		{
			return FirstOrDefault(z => z.Id == id);
		}

		public virtual Task<IEnumerable<TEntity>> GetAll()
		{
			return Task.FromResult(_set.AsEnumerable());
		}

		public virtual async Task<TEntity> FirstOrDefault(Expression<Func<TEntity, bool>> predicate)
		{
			return await _set.FirstOrDefaultAsync(predicate);
		}

		public virtual async Task<OperationResult<int>> Insert(TEntity entity)
		{
			await _set.AddAsync(entity);
			return await Save();
		}

		public virtual async Task<OperationResult<int>> Update(TEntity entity)
		{
			_context.Entry(entity).State = EntityState.Modified;
			return await Save();
		}

		public virtual async Task<OperationResult<int>> Delete(TEntity entity)
		{
			_set.Remove(entity);
			return await Save();
		}

		public virtual async Task<OperationResult<int>> Save()
		{
			int result;
			try
			{
				result = await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				return OperationResult<int>.CreateFailure(ex);
			}

			return OperationResult<int>.CreateSuccess(result);
		}

		public virtual Task<TEntity> Exists(TEntity entity)
		{
			return FirstOrDefault(t => t.Id == entity.Id);
		}

		public virtual async Task<int> Count() => await _set.CountAsync();

		// TODO: why bool?
		//public async Task<int> Count(Expression<Func<TEntity, bool>> predicate) => await _set.CountAsync(predicate);
	}
}
