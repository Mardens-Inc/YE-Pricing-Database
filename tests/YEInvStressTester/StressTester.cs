using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net.Http.Json;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace YEInvStressTester;

internal class StressTester
{
    private readonly ConcurrentDictionary<string, long> _results = [];
    private const int Iterations = 1_000;
    private readonly int _threads = Environment.ProcessorCount;
    private readonly Random _random = new();

    private void Run()
    {
        long startTime = DateTime.Now.Ticks;
        _results["post"] = 0;
        _results["get"] = 0;
        _results["patch"] = 0;
        _results["delete"] = 0;
        Parallel.For(0, Iterations, new ParallelOptions { MaxDegreeOfParallelism = _threads }, i =>
        {
            Task[] tasks =
            [
                // MakeGetRequest(),
                MakePostRequest(),
                // MakePutRequest(),
                // MakeDeleteRequest()
            ];
            Task.WaitAll(tasks);
        });

        TimeSpan totalTimeForPost = TimeSpan.FromTicks(_results["post"]);
        TimeSpan totalTimeForGet = TimeSpan.FromTicks(_results["get"]);
        TimeSpan totalTimeForPatch = TimeSpan.FromTicks(_results["patch"]);
        TimeSpan totalTimeForDelete = TimeSpan.FromTicks(_results["delete"]);

        // GET
        Console.WriteLine($"Total time for {Iterations} GET requests: {totalTimeForGet.TotalSeconds} seconds");
        Console.WriteLine($"Average time for a GET request: {totalTimeForGet.TotalSeconds / Iterations} seconds");

        // POST
        Console.WriteLine($"Total time for {Iterations} POST requests: {totalTimeForPost.TotalSeconds} seconds");
        Console.WriteLine($"Average time for a POST request: {totalTimeForPost.TotalSeconds / Iterations} seconds");

        // DELETE
        Console.WriteLine($"Total time for {Iterations} DELETE requests: {totalTimeForDelete.TotalSeconds} seconds");
        Console.WriteLine($"Average time for a DELETE request: {totalTimeForDelete.TotalSeconds / Iterations} seconds");

        // PATCH
        Console.WriteLine($"Total time for {Iterations} PATCH requests: {totalTimeForPatch.TotalSeconds} seconds");
        Console.WriteLine($"Average time for a PATCH request: {totalTimeForPatch.TotalSeconds / Iterations} seconds");

        Console.WriteLine($"Total time for all requests: {TimeSpan.FromTicks(DateTime.Now.Ticks - startTime).TotalSeconds} seconds");
    }

    private static async Task MakeGetRequest()
    {
        using var client = new HttpClient();
        await client.GetAsync("https://yeinv.mardens.com/api/");
    }

    private async Task MakePostRequest()
    {
        long startTime = DateTime.Now.Ticks;
        string json = JsonConvert.SerializeObject(
            new
            {
                tag_number = _random.Next(0000, 9999),
                store = _random.Next(0, 12),
                department = _random.Next(0, 7),
                percent = Math.Round(_random.Next(100, 10_000) / 100d, 2),
                mardens_price = Math.Round(_random.Next(1_000, 1_000_000) / 100d, 2),
                quantity = _random.Next(1, 256),
                description = "test record",
                employee = _random.Next(1, 612)
            }
        );

        using (var handler = new HttpClientHandler())
        {
            handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            using (var client = new HttpClient(handler))
            {
                using HttpRequestMessage message = new(HttpMethod.Post, "https://yeinv.mardens.com/api/");
                message.Content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.SendAsync(message);
                if (!response.IsSuccessStatusCode)
                {
                    await Console.Error.WriteLineAsync($"Failed to post record: {json}\nResponse: {await response.Content.ReadAsStringAsync()}");
                }
            }
        }

        _results["post"] += DateTime.Now.Ticks - startTime;
    }

    private static async Task MakePutRequest()
    {
        using var client = new HttpClient();
        await client.PutAsync("https://yeinv.mardens.com/api/", new StringContent(""));
    }

    private static async Task MakeDeleteRequest()
    {
        using var client = new HttpClient();
        await client.DeleteAsync("https://yeinv.mardens.com/api/");
    }

    private static void Main(string[] args)
    {
        var stressTester = new StressTester();
        stressTester.Run();
    }
}