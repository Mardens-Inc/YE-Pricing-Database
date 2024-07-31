using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace api.Models;

/// <summary>
/// Represents an inventory entry.
/// </summary>
public struct InventoryEntryModel
{
    [JsonPropertyName("id"), JsonProperty("id")]
    public int Id { get; set; }

    /// <summary>
    /// Represents the tag number of an inventory entry.
    /// </summary>
    [JsonPropertyName("tag_number"), JsonProperty("tag_number")]
    public int TagNumber { get; set; }

    [JsonPropertyName("store"), JsonProperty("store")]
    public int Store { get; set; }

    /// <summary>
    /// Represents the department of an inventory entry.
    /// </summary>
    [JsonPropertyName("department"), JsonProperty("department")]
    public int Department { get; set; }

    /// <summary>
    /// Represents the percent property in the <see cref="InventoryEntryModel"/> class.
    /// </summary>
    [JsonPropertyName("percent"), JsonProperty("percent")]
    public double Percent { get; set; }

    /// <summary>
    /// Represents the Marden's price of an inventory entry.
    /// </summary>
    [JsonPropertyName("mardens_price"), JsonProperty("mardens_price")]
    public double MardensPrice { get; set; }

    /// <summary>
    /// Represents the quantity of an inventory item.
    /// </summary>
    [JsonPropertyName("quantity"), JsonProperty("quantity")]
    public int Quantity { get; set; }

    /// <summary>
    /// Represents a single inventory entry.
    /// </summary>
    [JsonPropertyName("description"), JsonProperty("description")]
    public string Description { get; set; }

    /// <summary>
    /// Represents an employee in the inventory system.
    /// </summary>
    [JsonPropertyName("employee"), JsonProperty("employee")]
    public int Employee { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the inventory entry was created.
    /// </summary>
    [JsonPropertyName("created_at"), JsonProperty("created_at")]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the inventory entry was last updated.
    /// </summary>
    /// <value>The date and time when the inventory entry was last updated.</value>
    [JsonPropertyName("updated_at"), JsonProperty("updated_at")]
    public DateTime UpdatedAt { get; set; }

    public static InventoryEntryModel Empty => new()
    {
        Id = 0,
        TagNumber = 0,
        Store = 0,
        Department = 0,
        Percent = 0,
        MardensPrice = 0,
        Quantity = 0,
        Description = "",
        Employee = 0,
        CreatedAt = DateTime.MinValue,
        UpdatedAt = DateTime.MinValue
    };
}