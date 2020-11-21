﻿using Microsoft.EntityFrameworkCore;
using neck.Comparers;
using neck.Converters;
using neck.Interfaces;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace neck.Models.Db
{

	public class NeckContext : DbContext
	{
		public DbSet<ChordVariation> ChordVariations { get; set; }

		public NeckContext(DbContextOptions<NeckContext> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<ChordVariation>(entity =>
			{
				entity.Property(v => v.Positions)
					.HasConversion(
						p => PositionsConverter.ListToString(p),
						p => PositionsConverter.StringToNullableList(p)
					)
					.Metadata
					.SetValueComparer(PositionsComparer.CompareNullable);

				entity.Property(v => v.Barre)
					.HasConversion(
						b => PositionsConverter.ListToString(b),
						b => PositionsConverter.StringToNullableList(b)
					)
					.Metadata
					.SetValueComparer(PositionsComparer.CompareNullable);
			});

			modelBuilder.Entity<Tuning>(entity =>
			{
				entity.Property(t => t.Offsets)
					.HasConversion(
						t => PositionsConverter.ListToString(t),
						t => PositionsConverter.StringToList(t, 0)
					)
					.Metadata
					.SetValueComparer(PositionsComparer.Compare);
			});
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
