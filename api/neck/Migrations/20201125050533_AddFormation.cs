using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class AddFormation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tuning");

            migrationBuilder.DropColumn(
                name: "Barre",
                table: "ChordVariations");

            migrationBuilder.DropColumn(
                name: "Positions",
                table: "ChordVariations");

            migrationBuilder.AddColumn<Guid>(
                name: "ChordId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormationId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TuningId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Formations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Positions = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Formations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Base = table.Column<int>(type: "int", nullable: false),
                    Suffix = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tunings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Offsets = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tunings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Chords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RootId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Modifier = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chords_Notes_RootId",
                        column: x => x.RootId,
                        principalTable: "Notes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChordVariations_ChordId",
                table: "ChordVariations",
                column: "ChordId");

            migrationBuilder.CreateIndex(
                name: "IX_ChordVariations_FormationId",
                table: "ChordVariations",
                column: "FormationId");

            migrationBuilder.CreateIndex(
                name: "IX_ChordVariations_TuningId",
                table: "ChordVariations",
                column: "TuningId");

            migrationBuilder.CreateIndex(
                name: "IX_Chords_RootId_Modifier",
                table: "Chords",
                columns: new[] { "RootId", "Modifier" });

            migrationBuilder.CreateIndex(
                name: "IX_Formations_Positions",
                table: "Formations",
                column: "Positions");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_Base_Suffix",
                table: "Notes",
                columns: new[] { "Base", "Suffix" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Chords_ChordId",
                table: "ChordVariations",
                column: "ChordId",
                principalTable: "Chords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Formations_FormationId",
                table: "ChordVariations",
                column: "FormationId",
                principalTable: "Formations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Tunings_TuningId",
                table: "ChordVariations",
                column: "TuningId",
                principalTable: "Tunings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Chords_ChordId",
                table: "ChordVariations");

            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Formations_FormationId",
                table: "ChordVariations");

            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Tunings_TuningId",
                table: "ChordVariations");

            migrationBuilder.DropTable(
                name: "Chords");

            migrationBuilder.DropTable(
                name: "Formations");

            migrationBuilder.DropTable(
                name: "Tunings");

            migrationBuilder.DropTable(
                name: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_ChordId",
                table: "ChordVariations");

            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_FormationId",
                table: "ChordVariations");

            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_TuningId",
                table: "ChordVariations");

            migrationBuilder.DropColumn(
                name: "ChordId",
                table: "ChordVariations");

            migrationBuilder.DropColumn(
                name: "FormationId",
                table: "ChordVariations");

            migrationBuilder.DropColumn(
                name: "TuningId",
                table: "ChordVariations");

            migrationBuilder.AddColumn<string>(
                name: "Barre",
                table: "ChordVariations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Positions",
                table: "ChordVariations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tuning",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Offsets = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tuning", x => x.Id);
                });
        }
    }
}
