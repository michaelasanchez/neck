using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace neck.Migrations
{
    public partial class AddInstrument : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "InstrumentId",
                table: "Tunings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "Tunings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Instruments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumStrings = table.Column<int>(type: "int", nullable: false),
                    DefaultTuningId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Instruments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Instruments_Tunings_DefaultTuningId",
                        column: x => x.DefaultTuningId,
                        principalTable: "Tunings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tunings_InstrumentId",
                table: "Tunings",
                column: "InstrumentId");

            migrationBuilder.CreateIndex(
                name: "IX_Instruments_DefaultTuningId",
                table: "Instruments",
                column: "DefaultTuningId",
                unique: true,
                filter: "[DefaultTuningId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Tunings_Instruments_InstrumentId",
                table: "Tunings",
                column: "InstrumentId",
                principalTable: "Instruments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.Sql(@"
                DECLARE @noteId UNIQUEIDENTIFIER = NEWID();
                DECLARE @instrumentId UNIQUEIDENTIFIER = NEWID();
                DECLARE @tuningId UNIQUEIDENTIFIER = NEWID();

                DECLARE @now DATETIMEOFFSET = SYSDATETIMEOFFSET();

                INSERT INTO Notes (
                    Id,
                    Base,
                    Suffix,
                    Created,
                    Updated
                ) VALUES (
                    @noteId,
                    0,
                    0,
                    @now,
                    @now
                )

                INSERT INTO Chords (
                    Id,
                    RootId,
                    Modifier,
                    Created,
                    Updated
                ) VALUES (
                    NEWID(),
                    @noteId,
                    0,
                    @now,
                    @now
                )

                INSERT INTO Instruments (
	                Id,
	                Label,
	                NumStrings,
	                Created,
	                Updated
                ) VALUES (
	                @instrumentId,
	                'Guitar',
	                6,
	                @now,
	                @now            
                )

                INSERT INTO Tunings (
                    Id,
                    Label,
                    [Offsets],
                    InstrumentId,
                    Created,
                    Updated
                ) VALUES (
                    @tuningId,
                    'Standard Tuning',
                    '4,9,2,7,11,4',
                    @instrumentId,
                    @now,
                    @now
                )

                UPDATE Instruments
	                SET DefaultTuningId = @tuningId
	                WHERE Id = @instrumentId
                ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tunings_Instruments_InstrumentId",
                table: "Tunings");

            migrationBuilder.DropTable(
                name: "Instruments");

            migrationBuilder.DropIndex(
                name: "IX_Tunings_InstrumentId",
                table: "Tunings");

            migrationBuilder.DropColumn(
                name: "InstrumentId",
                table: "Tunings");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "Tunings");
        }
    }
}
