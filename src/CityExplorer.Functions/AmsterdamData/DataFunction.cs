using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CityExplorer.Functions.Storage;
using Microsoft.Azure.WebJobs;
using Newtonsoft.Json;

namespace CityExplorer.Functions.AmsterdamData
{
    public static class DataFunction
    {
        private static readonly string _foodFileName = "eat-drinks.json";
        private static readonly string _eventsFileName = "events.json";
        private static readonly string _attractionFileName = "attractions.json";
        private static IStorageService _storageService = new StorageService();

        [FunctionName("DataFunction")]
        public static async Task<IEnumerable<ResultModel>> GetResult([ActivityTrigger] DataType type)
        {
            var filename = string.Empty;
            switch (type)
            {
                case DataType.Food:
                    filename = _foodFileName;
                    break;
                case DataType.Events:
                    filename = _eventsFileName;
                    break;
                case DataType.Attraction:
                    filename = _attractionFileName;
                    break;
                default:
                    return Enumerable.Empty<ResultModel>();
            }

            var blob = _storageService.GetBlob(filename);
            if (blob != null)
            {
                var text = await blob.DownloadTextAsync();

                var result = JsonConvert.DeserializeObject<IEnumerable<ResultModel>>(text);
                if (result != null)
                {
                    return result;
                }
            }
            return Enumerable.Empty<ResultModel>();
        }
    }
}
