using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController, Route("/api/inventory"), Produces("application/json")]
public class InventoryController : ControllerBase
{
    /// <summary>
    /// Retrieves a range of inventory entries based on the specified criteria.
    /// </summary>
    /// <param name="page">The page number of the results (default is 1).</param>
    /// <param name="limit">The maximum number of entries per page (default is 10).</param>
    /// <param name="sort">The field to sort the results by (default is "created_at").</param>
    /// <param name="order">The sorting order ("asc" or "desc", default is "desc").</param>
    /// <param name="from">The start date/time of the range (default is null).</param>
    /// <param name="to">The end date/time of the range (default is null).</param>
    /// <param name="store">The ID of the store (default is null).</param>
    /// <param name="department">The ID of the department (default is null).</param>
    /// <param name="employee">The ID of the employee (default is null).</param>
    /// <returns>The result of the inventory entry list operation.</returns>
    [HttpGet]
    public InventoryEntryListResult Range(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string sort = "created_at",
        [FromQuery] string order = "desc",
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] int? store = null,
        [FromQuery] int? department = null,
        [FromQuery] int? employee = null
    )
    {
        return new InventoryEntryListResult()
        {
            Results = [],
            Total = 0,
            Count = 0,
            Page = 0,
            LastPage = 0,
        };
    }
}