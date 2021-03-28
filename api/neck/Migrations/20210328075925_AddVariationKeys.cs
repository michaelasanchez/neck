using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class AddVariationKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ScaleVariations_ScaleId",
                table: "ScaleVariations",
                column: "ScaleId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_ScaleVariations_Scales_ScaleId",
                table: "ScaleVariations",
                column: "ScaleId",
                principalTable: "Scales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChordVariations_Chords_ChordId",
                table: "ChordVariations");

            migrationBuilder.DropForeignKey(
                name: "FK_ScaleVariations_Scales_ScaleId",
                table: "ScaleVariations");

            migrationBuilder.DropIndex(
                name: "IX_ScaleVariations_ScaleId",
                table: "ScaleVariations");

            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_ChordId",
                table: "ChordVariations");
        }
    }
}
