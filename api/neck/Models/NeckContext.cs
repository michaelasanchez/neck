using Microsoft.EntityFrameworkCore;
using neck.Comparers;
using neck.Converters;
using neck.Interfaces;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace neck.Models
{

	public class NeckContext : DbContext
	{
		public DbSet<ChordVariation> ChordVariations { get; set; }

		public NeckContext(DbContextOptions<NeckContext> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Formation>(entity =>
			{
				entity.Ignore(f => f.Hash);
				entity.Property(f => f.Positions)
					.HasConversion(
						p => PositionsConverter.ListToString(p),
						p => PositionsConverter.StringToNullableList(p)
					)
					.Metadata
					.SetValueComparer(PositionsComparer.CompareNullable);
			});

			modelBuilder.Entity<Tuning>()
				.Property(t => t.Offsets)
				.HasConversion(
					o => PositionsConverter.ListToString(o),
					o => PositionsConverter.StringToList(o, 0)
				)
				.Metadata
				.SetValueComparer(PositionsComparer.Compare);

			modelBuilder.Entity<Note>()
				.HasIndex(n => new { n.Base, n.Suffix })
				.IsUnique();
		}

		public override int SaveChanges()
		{
			AddTimestamps();
			return base.SaveChanges();
		}

		public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			AddTimestamps();
			return base.SaveChangesAsync(cancellationToken);
		}

		public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
		{
			AddTimestamps();
			return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
		}

		private void AddTimestamps()
		{
			var entities = ChangeTracker.Entries().Where(x => x.Entity is IDatedEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


			foreach (var entity in entities)
			{
				if (entity.State == EntityState.Added)
				{
					((IDatedEntity)entity.Entity).Created = DateTime.UtcNow;
				}

				((IDatedEntity)entity.Entity).Updated = DateTime.UtcNow;
			}
		}
	}
}
