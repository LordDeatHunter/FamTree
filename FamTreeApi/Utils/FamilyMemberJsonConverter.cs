using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using FamTreeApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FamTreeApi.Utils;

public class FamilyMemberJsonConverter : JsonConverter<FamilyMember>
{
    public override FamilyMember? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var id = reader.GetString();
        var db = new FamilyTreeDbContext(new DbContextOptionsBuilder<FamilyTreeDbContext>()
            .UseNpgsql(StaticData.Configuration.GetConnectionString("DefaultConnection")).Options);
        return id != null
            ? db.FamilyTree
                .Include(m => m.Mother)
                .Include(m => m.Father)
                .FirstOrDefault(m => m.Id.ToString() == id)
            : null;
    }

    public override void Write(Utf8JsonWriter writer, FamilyMember value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.Id);
}