﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using neck.Models;

namespace neck.Migrations
{
    [DbContext(typeof(NeckContext))]
    [Migration("20201126042356_AddIndexes")]
    partial class AddIndexes
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("neck.Models.Chord", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<int>("Modifier")
                        .HasColumnType("int");

                    b.Property<Guid>("RootId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("RootId", "Modifier")
                        .IsUnique();

                    b.ToTable("Chords");
                });

            modelBuilder.Entity("neck.Models.ChordVariation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ChordId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<Guid>("FormationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Label")
                        .HasColumnType("nvarchar(450)");

                    b.Property<Guid>("TuningId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("ChordId");

                    b.HasIndex("FormationId");

                    b.HasIndex("TuningId");

                    b.HasIndex("Label", "ChordId", "FormationId", "TuningId")
                        .IsUnique()
                        .HasFilter("[Label] IS NOT NULL");

                    b.ToTable("ChordVariations");
                });

            modelBuilder.Entity("neck.Models.Formation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Positions")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("Positions")
                        .IsUnique()
                        .HasFilter("[Positions] IS NOT NULL");

                    b.ToTable("Formations");
                });

            modelBuilder.Entity("neck.Models.Note", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Base")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<int>("Suffix")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("Base", "Suffix")
                        .IsUnique();

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("neck.Models.Tuning", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Offsets")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("Offsets")
                        .IsUnique()
                        .HasFilter("[Offsets] IS NOT NULL");

                    b.ToTable("Tunings");
                });

            modelBuilder.Entity("neck.Models.Chord", b =>
                {
                    b.HasOne("neck.Models.Note", "Root")
                        .WithMany()
                        .HasForeignKey("RootId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Root");
                });

            modelBuilder.Entity("neck.Models.ChordVariation", b =>
                {
                    b.HasOne("neck.Models.Chord", "Chord")
                        .WithMany()
                        .HasForeignKey("ChordId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("neck.Models.Formation", "Formation")
                        .WithMany()
                        .HasForeignKey("FormationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("neck.Models.Tuning", "Tuning")
                        .WithMany()
                        .HasForeignKey("TuningId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Chord");

                    b.Navigation("Formation");

                    b.Navigation("Tuning");
                });
#pragma warning restore 612, 618
        }
    }
}
