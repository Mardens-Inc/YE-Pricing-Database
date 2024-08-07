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
    private const int Iterations = 10_000;
    private readonly int _threads = Environment.ProcessorCount;
    private readonly Random _random = new();

    private readonly int[] _employeeIds =
    [
        60, 61, 62, 63, 64, 65, 66, 70, 71, 72, 74, 78, 79, 80, 83, 85, 89, 94, 98, 99, 102, 438, 439, 443, 446, 450, 451, 452, 453, 456, 459, 460, 464, 465, 467, 470, 474, 478, 484, 486, 489, 495, 497, 498, 502, 526, 543, 553, 554, 555, 556, 557, 558, 562, 565, 575, 582, 588, 591, 614, 639, 651, 664, 675, 726, 748, 764, 769, 774, 778, 829, 876, 880, 895, 937, 991, 1140, 1145, 1147, 1155, 1232, 1251, 1257, 1261, 1303, 1321, 1326, 1330, 1362, 1365, 1368, 1387, 1390, 1394, 1448, 1486, 1505, 1508,
        1540, 1566, 1573, 1583, 1588, 1619, 1675, 1676, 1685, 1704, 1734, 1739, 1767, 1818, 1825, 1829, 1835, 1842, 1858, 1862, 1877, 1880, 1892, 1917, 1924, 1925, 1932, 1934, 1941, 1943, 1946, 1951, 1959, 1960, 1961, 1963, 1964, 1965, 1968, 1971, 1974, 1975, 1978, 1986, 1988, 1989, 1990, 1993, 1994, 1995, 1997, 1998, 1999, 2000, 2001, 2089, 2090, 2093, 2094, 2097, 2120, 2123, 2127, 2130, 2146, 2166, 2194, 2195, 2210, 2229, 2238, 2289, 2310, 2312, 2342, 2352, 2358, 2359, 2363, 2383, 2520, 2617,
        2618, 2619, 2620, 2621, 2622, 2623, 2626, 2628, 2629, 2631, 2635, 2638, 2639, 2641, 2642, 2643, 2644, 2654, 2656, 2657, 2660, 2662, 2673, 2683, 2685, 2691, 2721, 2726, 2730, 2766, 2778, 2789, 2792, 2813, 2860, 2870, 2880, 3023, 3029, 3039, 3076, 3090, 3159, 3168, 3169, 3200, 3237, 3256, 3265, 3300, 3301, 3370, 3440, 3468, 3477, 3505, 3508, 3542, 3549, 3589, 3623, 3826, 3827, 3837, 3840, 3841, 3842, 3848, 3849, 3850, 3852, 3856, 3858, 3860, 3867, 3872, 3873, 3875, 3891, 3912, 3920, 3927,
        3930, 3937, 3942, 3946, 3949, 3950, 3977, 3978, 4000, 4007, 4018, 4031, 4032, 4071, 4102, 4141, 4142, 4152, 4154, 4165, 4179, 4192, 4270, 4337, 4358, 4360, 4374, 4417, 4421, 4442, 4465, 4483, 4490, 4598, 4600, 4667, 4672, 4763, 4822, 4831, 4864, 4870, 4895, 4905, 4906, 4913, 4984, 5022, 5023, 5040, 5044, 5051, 5059, 5070, 5089, 5090, 5102, 5112, 5118, 5119, 5155, 5186, 5259, 5324, 5421, 5444, 5514, 5810, 5877, 5923, 5983, 5989, 5993, 5994, 5998, 6003, 6011, 6019, 6044, 6091, 6146, 6148,
        6150, 6162, 6189, 6281, 6326, 6334, 6335, 6420, 6430, 6444, 6448, 6498, 6512, 6517, 6518, 6610, 6613, 6618, 6694, 6773, 6777, 6802, 6803, 6828, 6832, 6835, 6837, 6840, 6853, 6856, 6875, 6877, 6881, 6897, 6899, 6900, 6901, 6913, 6934, 6935, 6938, 6939, 6985, 6986, 7005, 7013, 7026, 7031, 7032, 7036, 7038, 7071, 7106, 7108, 7109, 7168, 7174, 7200, 7238, 7255, 7297, 7302, 7304, 7305, 7312, 7328, 7341, 7347, 7358, 7381, 7622, 7656, 7658, 7673, 7721, 7799, 8000, 8002, 8012, 8056, 8066, 8082,
        8089, 8096, 8101, 8119, 8121, 8127, 8131, 8133, 8136, 8140, 8144, 8151, 8163, 8174, 8176, 8199, 8215, 8216, 8217, 8233, 8771, 8772, 8773, 8775, 8776, 8777, 8778, 8796, 8829, 8835, 8855, 8893, 8941, 8970, 8974, 8975, 8976, 9014, 9025, 9055, 9125, 9255, 9269, 9450, 9470, 9475, 9480, 9539, 9542, 9640, 31027, 31028, 31043, 31053, 31065, 31352, 31354, 31360, 31363, 31366, 31374, 31375, 31384, 31386, 31390, 31391, 31392, 31393, 31394, 32036, 32153, 32177, 32187, 32192, 32215, 32224, 32244,
        32263, 32265, 32272, 32277, 32279, 32283, 32295, 32303, 32310, 32311, 32312, 32316, 32317, 32318, 32319, 32320, 35011, 35052, 35064, 35100, 35102, 35114, 35117, 35119, 35120, 35123, 35131, 35136, 35143, 35144, 35146, 35147, 35149, 35151, 35152, 35157, 35160, 35165, 35166, 35167, 35168, 35169, 35170, 35171, 40001, 40004, 40010, 40016, 40020, 40022, 40023, 40024, 40028, 40030, 40031, 40032, 40034, 40035, 40036, 46020, 46024, 46026, 46031, 46053, 46054, 46056, 46061, 46064, 46068, 46104,
        46116, 46123, 46124, 46128, 46138, 46142, 46144, 46147, 46148, 46151, 46159, 46161, 46162, 46163, 46164, 46165, 46166, 46168, 46170, 46171, 46172, 46173, 46177, 46178, 46179, 46180, 46181, 46185, 46186, 46187, 46188, 48004, 48007, 48008, 48014, 48015, 48018, 48019, 48021, 55009, 55014, 55016, 55029, 55035, 55036, 55037, 55038, 55039, 55040, 55041, 55044, 55055, 55057, 55058, 55059
    ];

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
                MakeGetRequest(),
                MakePostRequest(),
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
                percent = Math.Round(_random.Next(100, 10_000) / 10000d, 4),
                mardens_price = Math.Round(_random.Next(1_000, 1_000_000) / 1000d, 2),
                quantity = _random.Next(1, 256),
                description = "test record",
                employee = _employeeIds[_random.Next(0, _employeeIds.Length)]
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