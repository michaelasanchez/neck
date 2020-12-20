using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class RemoveChordVariationChord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Chords_ChordId",
                table: "ChordVariations");

            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_ChordId",
                table: "ChordVariations");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ChordVariations_ChordId",
                table: "ChordVariations",
                column: "ChordId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChordVariations_Chords_ChordId",
                table: "ChordVariations",
                column: "ChordId",
                principalTable: "Chords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
