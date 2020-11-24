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
    [Migration("20201122100635_AddFormation")]
    partial class AddFormation
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

                    b.Property<Guid?>("RootId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("RootId");

                    b.ToTable("Chord");
                });

            modelBuilder.Entity("neck.Models.ChordVariation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("ChordId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<Guid?>("FormationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Label")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("TuningId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("ChordId");

                    b.HasIndex("FormationId");

                    b.HasIndex("TuningId");

                    b.ToTable("ChordVariations");
                });

            modelBuilder.Entity("neck.Models.Formation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<int>("Hash")
                        .HasColumnType("int");

                    b.Property<string>("Positions")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("Id", "Hash");

                    b.ToTable("Formation");
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

                    b.ToTable("Note");
                });

            modelBuilder.Entity("neck.Models.Tuning", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Offsets")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset?>("Updated")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.ToTable("Tuning");
                });

            modelBuilder.Entity("neck.Models.Chord", b =>
                {
                    b.HasOne("neck.Models.Note", "Root")
                        .WithMany()
                        .HasForeignKey("RootId");

                    b.Navigation("Root");
                });

            modelBuilder.Entity("neck.Models.ChordVariation", b =>
                {
                    b.HasOne("neck.Models.Chord", "Chord")
                        .WithMany()
                        .HasForeignKey("ChordId");

                    b.HasOne("neck.Models.Formation", "Formation")
                        .WithMany()
                        .HasForeignKey("FormationId");

                    b.HasOne("neck.Models.Tuning", "Tuning")
                        .WithMany()
                        .HasForeignKey("TuningId");

                    b.Navigation("Chord");

                    b.Navigation("Formation");

                    b.Navigation("Tuning");
                });
#pragma warning restore 612, 618
        }
    }
}
