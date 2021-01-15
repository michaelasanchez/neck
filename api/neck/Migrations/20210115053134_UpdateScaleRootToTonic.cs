using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class UpdateScaleRootToTonic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scales_Notes_RootId",
                table: "Scales");

            migrationBuilder.RenameColumn(
                name: "RootId",
                table: "Scales",
                newName: "TonicId");

            migrationBuilder.RenameIndex(
                name: "IX_Scales_RootId_Type",
                table: "Scales",
                newName: "IX_Scales_TonicId_Type");

            migrationBuilder.AddForeignKey(
                name: "FK_Scales_Notes_TonicId",
                table: "Scales",
                column: "TonicId",
                principalTable: "Notes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scales_Notes_TonicId",
                table: "Scales");

            migrationBuilder.RenameColumn(
                name: "TonicId",
                table: "Scales",
                newName: "RootId");

            migrationBuilder.RenameIndex(
                name: "IX_Scales_TonicId_Type",
                table: "Scales",
                newName: "IX_Scales_RootId_Type");

            migrationBuilder.AddForeignKey(
                name: "FK_Scales_Notes_RootId",
                table: "Scales",
                column: "RootId",
                principalTable: "Notes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
