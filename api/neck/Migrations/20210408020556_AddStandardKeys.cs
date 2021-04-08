using Microsoft.EntityFrameworkCore.Migrations;
using neck.Models.Entity;
using neck.Models.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace neck.Migrations
{
    public partial class AddStandardKeys : Migration
    {
        private List<Key> _majorKeys = new List<Key>
        {
            new Key(Note.C()),
            new Key(Note.G()),
            new Key(Note.D()),
            new Key(Note.A()),
            new Key(Note.E()),
            new Key(Note.B()),
            new Key(Note.F().Sharp()),
            new Key(Note.C().Sharp()),
            new Key(Note.F()),
            new Key(Note.B().Flat()),
            new Key(Note.E().Flat()),
            new Key(Note.A().Flat()),
            new Key(Note.D().Flat()),
            new Key(Note.G().Flat()),
            new Key(Note.C().Flat())
        };

        private List<Key> _minorKeys = new List<Key>
        {
            new Key(Note.A(), KeyType.Minor),
            new Key(Note.E(), KeyType.Minor),
            new Key(Note.B(), KeyType.Minor),
            new Key(Note.F().Sharp(), KeyType.Minor),
            new Key(Note.C().Sharp(), KeyType.Minor),
            new Key(Note.G().Sharp(), KeyType.Minor),
            new Key(Note.D().Sharp(), KeyType.Minor),
            new Key(Note.D(), KeyType.Minor),
            new Key(Note.G(), KeyType.Minor),
            new Key(Note.C(), KeyType.Minor),
            new Key(Note.F(), KeyType.Minor),
            new Key(Note.B().Flat(), KeyType.Minor),
            new Key(Note.E().Flat(), KeyType.Minor)
        };

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Keys_Type_TonicId",
                table: "Keys");

            migrationBuilder.CreateIndex(
                name: "IX_Keys_Type_TonicId",
                table: "Keys",
                columns: new[] { "Type", "TonicId" },
                unique: true);

            foreach(var key in _majorKeys.Concat(_minorKeys))
            {
                AddKey(migrationBuilder, key);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Keys_Type_TonicId",
                table: "Keys");

            migrationBuilder.CreateIndex(
                name: "IX_Keys_Type_TonicId",
                table: "Keys",
                columns: new[] { "Type", "TonicId" });
        }

        protected void AddKey(MigrationBuilder migrationBuilder, Key key)
        {
            migrationBuilder.Sql(@$"
	            declare @now as datetime = getdate()

	            declare @base as int = {(int)key.Tonic.Base}
	            declare @suffix as int = {(int)key.Tonic.Suffix}
	            declare @tonicId as uniqueidentifier = (select Id from notes where base = @base and suffix = @suffix)


	            select @tonicId
	
	            if (@tonicId is null) 
	            begin
		            set @tonicId = newid()
		            insert into notes (Id, Base, Suffix, Created, Updated) values (@tonicId, @base, @suffix, @now, @now)
	            end

	            declare @keyId as uniqueidentifier
                declare @type as int = {(int)key.Type}

	            set @keyId = (select id from keys where tonicId = @tonicId and type = @type)

	            if (@keyId is null) 
                begin
                    set @keyId = newid()
	                insert into keys (Id, Created, Updated, Type, TonicId) VALUES (@keyId, @now, @now, @type, @tonicId)
                end
            ");
        }
    }
}
