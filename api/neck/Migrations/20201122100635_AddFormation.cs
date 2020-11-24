using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class AddFormation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "Formation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Hash = table.Column<int>(type: "int", nullable: false),
                    Positions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Formation", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Note",
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
                    table.PrimaryKey("PK_Note", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Chord",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RootId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Modifier = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chord_Note_RootId",
                        column: x => x.RootId,
                        principalTable: "Note",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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
                name: "IX_Chord_RootId",
                table: "Chord",
                column: "RootId");

            migrationBuilder.CreateIndex(
                name: "IX_Formation_Id_Hash",
                table: "Formation",
                columns: new[] { "Id", "Hash" });

            migrationBuilder.CreateIndex(
                name: "IX_Note_Base_Suffix",
                table: "Note",
                columns: new[] { "Base", "Suffix" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Chord_ChordId",
                table: "ChordVariations",
                column: "ChordId",
                principalTable: "Chord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Formation_FormationId",
                table: "ChordVariations",
                column: "FormationId",
                principalTable: "Formation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Tuning_TuningId",
                table: "ChordVariations",
                column: "TuningId",
                principalTable: "Tuning",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Chord_ChordId",
                table: "ChordVariations");

            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Formation_FormationId",
                table: "ChordVariations");

            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Tuning_TuningId",
                table: "ChordVariations");

            migrationBuilder.DropTable(
                name: "Chord");

            migrationBuilder.DropTable(
                name: "Formation");

            migrationBuilder.DropTable(
                name: "Note");

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
        }
    }
}
