using System;
using System.Text.Json.Serialization;
using FamTreeApi.Utils;

namespace FamTreeApi.Models;

public class FamilyMemberDto
{
    public required string Id { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Gender? Gender { get; set; }

    public string? CurrentName { get; set; }
    public string? BirthName { get; set; }
    public string? BirthLocation { get; set; }
    public string? CurrentLocation { get; set; }
    public DateOnly? BirthDate { get; set; }
    public DateOnly? DeathDate { get; set; }
    public string? Note { get; set; }
    public string? FatherId { get; set; }
    public string? MotherId { get; set; }
}