using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class RemoveChordVariationLabel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ChordVariations_Label_ChordId_FormationId_TuningId",
                table: "ChordVariations");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "ChordVariations");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "ChordVariations",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChordVariations_Label_ChordId_FormationId_TuningId",
                table: "ChordVariations",
                columns: new[] { "Label", "ChordId", "FormationId", "TuningId" },
                unique: true,
                filter: "[Label] IS NOT NULL");
        }
    }
}
