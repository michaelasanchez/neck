using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Db
{

    public class NeckContext : DbContext
    {
        public DbSet<ChordVariation> ChordVariations { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(Configuration["ConnectionStrings:NeckDatabase"]);
        //}

        public NeckContext(DbContextOptions<NeckContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ChordVariation>(entity =>
            {
                entity.Property(v => v.Positions).HasConversion(
                        p => string.Join(",", p.Select(n => n == null ? "null" : n.ToString())),
                        p => p.Split(',', StringSplitOptions.None).Select(n => (int?)Convert.ToInt32(n)).ToList()
                    );
                entity.Property(v => v.Barre).HasConversion(
                        b => string.Join(",", b.Select(n => n == null ? "null" : n.ToString())),
                        b => b.Split(',', StringSplitOptions.None).Select(n => (int?)Convert.ToInt32(n)).ToList()
                    );
            });

            modelBuilder.Entity<Tuning>(entity =>
            {
                entity.Property(t => t.Offsets).HasConversion(
                    t => t.ToString(),
                    t => t.Split(',', StringSplitOptions.None).Select(n => Convert.ToInt32(n)).ToList()
                );
            });
        }
    }
}
