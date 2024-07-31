using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace api.Models;

/// <summary>
/// Represents the result of an inventory entry list operation.
/// </summary>
public struct InventoryEntryListResult
{
    /// <summary>
    /// Represents the results of an inventory entry list query.
    /// </summary>
    [JsonPropertyName("results"), JsonProperty("results")]
    public InventoryEntryModel[] Results { get; set; }

    /// <summary>
    /// Gets or sets the count of inventory entries.
    /// </summary>
    [JsonPropertyName("count"), JsonProperty("count")]
    public int Count { get; set; }

    /// <summary>
    /// Gets or sets the total count of inventory entries.
    /// </summary>
    [JsonPropertyName("total"), JsonProperty("total")]
    public int Total { get; set; }

    /// <summary>
    /// Represents a page of inventory entries.
    /// </summary>
    [JsonPropertyName("page"), JsonProperty("page")]
    public int Page { get; set; }

    /// <summary>
    /// Gets or sets the last page number in a paginated result.
    /// </summary>
    [JsonPropertyName("last_page"), JsonProperty("last_page")]
    public int LastPage { get; set; }

    public static InventoryEntryListResult Empty => new()
    {
        Results = [],
        Total = 0,
        Count = 0,
        Page = 0,
        LastPage = 0,
    };
}