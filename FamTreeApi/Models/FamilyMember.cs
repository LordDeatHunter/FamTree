#nullable enable
using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using FamTreeApi.Utils;

namespace FamTreeApi.Models;

public class FamilyMember
{
    public FamilyMember()
    {
    }

    public FamilyMember(string birthName, string? currentName, DateTime birthDate, DateTime? deathDate, Gender gender)
    {
        BirthName = birthName;
        CurrentName = currentName ?? birthName;
        BirthDate = birthDate.ToUniversalTime();
        DeathDate = deathDate?.ToUniversalTime();
        Gender = gender;
    }

    public static FamilyMember createUniqueMember(string birthName, string? currentName, DateTime birthDate,
        DateTime? deathDate, Gender gender, FamilyTreeDbContext db)
    {
        var person = new FamilyMember(birthName, currentName, birthDate, deathDate, gender);
        while (db.FamilyTree.Any(m => person.Id == m.Id))
        {
            person.Id = Guid.NewGuid();
        }

        return person;
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Gender Gender { get; set; }

    public string BirthName { get; set; }
    public string CurrentName { get; set; }

    public DateTime BirthDate { get; set; }
    public DateTime? DeathDate { get; set; }

    [ForeignKey("FatherId")]
    [JsonConverter(typeof(FamilyMemberJsonConverter))]
    public FamilyMember? Father { get; set; }
    //[ForeignKey("FatherId")] public int? Father { get; set; }

    [ForeignKey("MotherId")]
    [JsonConverter(typeof(FamilyMemberJsonConverter))]
    public FamilyMember? Mother { get; set; }
    //[ForeignKey("MotherId")] public int? Mother { get; set; }
}