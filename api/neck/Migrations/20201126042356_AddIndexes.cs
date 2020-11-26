using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class AddIndexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropIndex(
                name: "IX_Formations_Positions",
                table: "Formations");

            migrationBuilder.DropIndex(
                name: "IX_Chords_RootId_Modifier",
                table: "Chords");

            migrationBuilder.AlterColumn<string>(
                name: "Offsets",
                table: "Tunings",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "TuningId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "ChordVariations",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "FormationId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ChordId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tunings_Offsets",
                table: "Tunings",
                column: "Offsets",
                unique: true,
                filter: "[Offsets] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Formations_Positions",
                table: "Formations",
                column: "Positions",
                unique: true,
                filter: "[Positions] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ChordVariations_Label_ChordId_FormationId_TuningId",
                table: "ChordVariations",
                columns: new[] { "Label", "ChordId", "FormationId", "TuningId" },
                unique: true,
                filter: "[Label] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Chords_RootId_Modifier",
                table: "Chords",
                columns: new[] { "RootId", "Modifier" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Chords_ChordId",
                table: "ChordVariations",
                column: "ChordId",
                principalTable: "Chords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Formations_FormationId",
                table: "ChordVariations",
                column: "FormationId",
                principalTable: "Formations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Tunings_TuningId",
                table: "ChordVariations",
                column: "TuningId",
                principalTable: "Tunings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.DropIndex(
                name: "IX_Tunings_Offsets",
                table: "Tunings");

            migrationBuilder.DropIndex(
                name: "IX_Formations_Positions",
                table: "Formations");

            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_Label_ChordId_FormationId_TuningId",
                table: "ChordVariations");

            migrationBuilder.DropIndex(
                name: "IX_Chords_RootId_Modifier",
                table: "Chords");

            migrationBuilder.AlterColumn<string>(
                name: "Offsets",
                table: "Tunings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "TuningId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "ChordVariations",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "FormationId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "ChordId",
                table: "ChordVariations",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_Formations_Positions",
                table: "Formations",
                column: "Positions");

            migrationBuilder.CreateIndex(
                name: "IX_Chords_RootId_Modifier",
                table: "Chords",
                columns: new[] { "RootId", "Modifier" });

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
    }
}
