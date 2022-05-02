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

    public FamilyMember(string birthName, string? currentName, string? birthLocation, string? currentLocation,
        DateOnly? birthDate, DateOnly? deathDate, Gender gender, string? note)
    {
        BirthName = birthName;
        CurrentName = currentName ?? birthName;
        BirthLocation = birthLocation ?? "Unknown Location";
        CurrentLocation = currentLocation ?? BirthLocation;
        BirthDate = birthDate;
        DeathDate = deathDate;
        Gender = gender;
        Note = note;
    }

    public static FamilyMember CreateUniqueMember(string birthName, string? currentName, string? birthLocation,
        string? currentLocation, DateOnly? birthDate,
        DateOnly? deathDate, Gender gender, string? note, FamilyTreeDbContext db)
    {
        var person = new FamilyMember(birthName, currentName, birthLocation, currentLocation, birthDate, deathDate,
            gender, note);
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

    public string? BirthLocation { get; set; }
    public string? CurrentLocation { get; set; }

    public DateOnly? BirthDate { get; set; }
    public DateOnly? DeathDate { get; set; }

    public string? Note { get; set; }

    [ForeignKey("FatherId")]
    [JsonConverter(typeof(FamilyMemberJsonConverter))]
    public FamilyMember? Father { get; set; }

    [ForeignKey("MotherId")]
    [JsonConverter(typeof(FamilyMemberJsonConverter))]
    public FamilyMember? Mother { get; set; }
}