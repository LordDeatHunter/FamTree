using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FamTreeApi.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamilyTree",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    BirthName = table.Column<string>(type: "text", nullable: false),
                    CurrentName = table.Column<string>(type: "text", nullable: false),
                    BirthLocation = table.Column<string>(type: "text", nullable: true),
                    CurrentLocation = table.Column<string>(type: "text", nullable: true),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DeathDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true),
                    FatherId = table.Column<Guid>(type: "uuid", nullable: true),
                    MotherId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyTree", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyTree_FamilyTree_FatherId",
                        column: x => x.FatherId,
                        principalTable: "FamilyTree",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FamilyTree_FamilyTree_MotherId",
                        column: x => x.MotherId,
                        principalTable: "FamilyTree",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyTree_FatherId",
                table: "FamilyTree",
                column: "FatherId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyTree_MotherId",
                table: "FamilyTree",
                column: "MotherId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyTree");
        }
    }
}
