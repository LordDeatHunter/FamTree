using Microsoft.EntityFrameworkCore;

namespace FamTreeApi.Models;

public class FamilyTreeDbContext : DbContext
{
    public FamilyTreeDbContext(DbContextOptions<FamilyTreeDbContext> options) : base(options)
    {
    }

    public DbSet<FamilyMember> FamilyTree { get; set; }
}