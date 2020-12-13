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

		protected bool GetAllDefaultIncludes = false;

		protected string DefaultSuccessMessage = $"{nameof(TEntity)} found";
		protected string DefaultFailureMessage = $"Could not find {nameof(TEntity)}";

		public GenericRepository(NeckContext context)
		{
			_context = context;
			_set = _context.Set<TEntity>();
		}

		public virtual IQueryable<TEntity> DefaultIncludes() => _set.AsQueryable();

		public virtual async Task<OperationResult<TEntity>> GetByIdAsync(Guid? id)
		{
			var result = await DefaultIncludes().FirstOrDefaultAsync(t => t.Id == id);
			return BuildGetOperationResult(result);
		}

		public virtual async Task<OperationResult<TEntity>> Get(TEntity entity)
		{
			var result = await _set.FirstOrDefaultAsync(t => t.Id == entity.Id);
			return BuildGetOperationResult(result);
		}

		// Must override for default includes
		public virtual Task<OperationResult<IEnumerable<TEntity>>> GetAll()
		{
			var enumerable = GetAllDefaultIncludes
				? BuildGetOperationResult(DefaultIncludes().AsEnumerable())
				: BuildGetOperationResult(_set.AsEnumerable());
			return Task.FromResult(enumerable);
		}

		public virtual async Task<OperationResult<TEntity>> GetOrCreate(TEntity entity)
		{
			var getResult = await Get(entity);
			if (!getResult.Success)
			{
				var createResult = await Create(entity);
				if (!createResult.Success)
				{
					return OperationResult<TEntity>.CreateFailure($"Failed to create {typeof(TEntity)}");
				}

				return BuildGetOperationResult(entity);
			}

			return BuildGetOperationResult(getResult.Result);
		}

		public virtual async Task<OperationResult<int>> Create(TEntity entity)
		{
			var result = await Get(entity);
			if (result.Success)
			{
				return OperationResult<int>.CreateFailure($"{typeof(TEntity)} already exists");
			}

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

		public async Task<int> Count(Expression<Func<TEntity, bool>> predicate) => await _set.CountAsync(predicate);

		#region protected

		protected OperationResult<TResult> BuildGetOperationResult<TResult>(TResult entity)
		{
			var located = entity != null;
			return new OperationResult<TResult>()
			{
				Message = located ? DefaultSuccessMessage : DefaultFailureMessage,
				Result = entity,
				Success = located
			};
		}

		#endregion
	}
}
