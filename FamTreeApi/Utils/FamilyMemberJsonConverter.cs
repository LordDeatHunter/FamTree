using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using FamTreeApi.Models;

namespace FamTreeApi.Utils;

public class FamilyMemberJsonConverter : JsonConverter<FamilyMember>
{
    public override FamilyMember Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        throw new NotImplementedException();

    public override void Write(Utf8JsonWriter writer, FamilyMember value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.Id);
}