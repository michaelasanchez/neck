using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class UpdateTuningKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tunings_InstrumentId",
                table: "Tunings");

            migrationBuilder.DropIndex(
                name: "IX_Tunings_Offsets",
                table: "Tunings");

            migrationBuilder.CreateIndex(
                name: "IX_Tunings_InstrumentId_Offsets",
                table: "Tunings",
                columns: new[] { "InstrumentId", "Offsets" },
                unique: true,
                filter: "[Offsets] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tunings_InstrumentId_Offsets",
                table: "Tunings");

            migrationBuilder.CreateIndex(
                name: "IX_Tunings_InstrumentId",
                table: "Tunings",
                column: "InstrumentId");

            migrationBuilder.CreateIndex(
                name: "IX_Tunings_Offsets",
                table: "Tunings",
                column: "Offsets",
                unique: true,
                filter: "[Offsets] IS NOT NULL");
        }
    }
}
