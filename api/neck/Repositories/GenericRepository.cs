using Microsoft.EntityFrameworkCore;
using neck.Interfaces;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class GenericRepository<TEntity> : IRepository<TEntity>
		where TEntity : class, IDbEntity
	{
		private NeckContext _context;

		protected DbSet<TEntity> _set { get; set; }

		protected static bool GetAllDefaultIncludes = false;

		protected static string DefaultFailureMessage = "Operation failed";

		protected static string OldDefaultSuccessMessage = $"{TrimType(typeof(TEntity))} found";
		protected static string OldDefaultFailureMessage = $"Could not find {TrimType(typeof(TEntity))}";

		static Func<Type, string> TrimType = (Type type) => OperationResult.trimType(type);

		public GenericRepository(NeckContext context)
		{
			_context = context;
			_set = _context.Set<TEntity>();
		}

		public virtual IQueryable<TEntity> DefaultIncludes() => _set.AsQueryable();

		public virtual async Task<OperationResult<TEntity>> GetById(Guid? id)
		{
			var result = await DefaultIncludes().FirstOrDefaultAsync(t => t.Id == id);
			return BuildGetOperationResult(result);
		}

		public virtual async Task<OperationResult<TEntity>> Get(TEntity entity)
		{
			var result = await _set.FirstOrDefaultAsync(t => t.Id == entity.Id);
			return BuildGetOperationResult(result);
		}

		public virtual Task<OperationResult<IEnumerable<TEntity>>> GetBy(Expression<Func<TEntity, bool>> predicate)
		{
			var result = (GetAllDefaultIncludes ? DefaultIncludes() : _set).Where(predicate);
			return Task.FromResult(BuildGetOperationResult(result.AsEnumerable()));
		}

		public virtual Task<OperationResult<IEnumerable<TEntity>>> GetAll()
		{
			var result = (GetAllDefaultIncludes ? DefaultIncludes() : _set).AsEnumerable();
			return Task.FromResult(BuildGetOperationResult(result));
		}

		public virtual async Task<OperationResult<TEntity>> Locate(TEntity entity)
		{
			var getResult = await Get(entity);
			if (!getResult.Success)
			{
				var createResult = await Create(entity);
				if (!createResult.Success)
				{
					return createResult;
				}

				return BuildGetOperationResult(createResult.Result);
			}

			return BuildGetOperationResult(getResult.Result);
		}

		public virtual async Task<OperationResult<TEntity>> Create(TEntity entity)
		{
			var result = await Get(entity);
			if (result.Success)
			{
				return OperationResult<TEntity>.CreateFailure($"{TrimType(typeof(TEntity))} already exists");
			}

			var entry = await _set.AddAsync(entity);

			// TODO: Figure out where to put this
			var saveResult = await Save();
			if (!saveResult.Success)
			{
				return OperationResult<TEntity>.CreateFailure($"Failed to save {TrimType(typeof(TEntity))}: {saveResult.Message}");
			}

			return BuildEntityResult(entry.Entity);
		}

		public virtual async Task<OperationResult<TEntity>> Update(TEntity entity)
		{
			var entry = _context.Entry(entity);
			entry.State = EntityState.Modified;

			// TODO: error checking?
			var saveResult = await Save();
			if (!saveResult.Success)
			{
				return OperationResult<TEntity>.CreateFailure($"Failed to save {TrimType(typeof(TEntity))}: {saveResult.Message}");
			}

			return BuildEntityResult(entry.Entity);
		}

		public virtual Task<OperationResult<TEntity>> Delete(TEntity entity)
		{
			var entry = _set.Remove(entity);
			var deleteSuccess = entry.State == EntityState.Deleted;

			return BuildEntityResultAsync(entry.Entity, deleteSuccess);
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

		#region Operation Results

		protected OperationResult<TEntity> BuildEntityResult(TEntity entity, bool success = true)
		{
			return new OperationResult<TEntity>()
			{
				Message = success ? null : DefaultFailureMessage,
				Result = entity,
				Success = success
			};
		}

		protected Task<OperationResult<TEntity>> BuildEntityResultAsync(TEntity entity, bool success = true)
		{
			return Task.FromResult(BuildEntityResult(entity, success));
		}

		protected OperationResult<TResult> BuildGetOperationResult<TResult>(TResult entity)
		{
			var located = entity != null;
			return new OperationResult<TResult>()
			{
				Message = located ? OldDefaultSuccessMessage : OldDefaultFailureMessage,
				Result = entity,
				Success = located
			};
		}

		#endregion

	}
}
