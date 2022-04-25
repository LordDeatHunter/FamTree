using System.Text.Json.Serialization;

namespace FamTreeApi.Utils;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Gender
{
    Male,
    Female
}