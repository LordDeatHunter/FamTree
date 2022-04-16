#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FamTreeApi.Models;

public class FamilyMember
{
    public FamilyMember()
    {
    }

    public FamilyMember(string birthName, string? currentName, DateTime birthDate, DateTime? deathDate, EGender gender)
    {
        BirthName = birthName;
        CurrentName = currentName ?? birthName;
        BirthDate = birthDate.ToUniversalTime();
        DeathDate = deathDate?.ToUniversalTime();
        Gender = gender;
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public EGender Gender { get; set; }

    public string BirthName { get; set; }
    public string CurrentName { get; set; }

    public DateTime BirthDate { get; set; }
    public DateTime? DeathDate { get; set; }

    //[ForeignKey("FatherId")] public FamilyMember? Father { get; set; }
    [ForeignKey("FatherId")] public int? Father { get; set; }
    //[ForeignKey("MotherId")] public FamilyMember? Mother { get; set; }
    [ForeignKey("MotherId")] public int? Mother { get; set; }

    public enum EGender
    {   
        Male, Female
    }
}