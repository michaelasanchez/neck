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
                entity.HasKey(e => e.ID);
            });

            //    modelBuilder.Entity<Book>(entity =>
            //    {
            //        entity.HasKey(e => e.ISBN);
            //        entity.Property(e => e.Title).IsRequired();
            //        entity.HasOne(d => d.Publisher)
            //          .WithMany(p => p.Books);
            //    });
        }
    }
}
