using Newtonsoft.Json;

namespace CityExplorer.Functions
{
    public class Coordinates
    {
        [JsonProperty("Latitude")]
        public double Latitude { get; set; }
        [JsonProperty("longitude")]
        public double Longitude { get; set; }
    }
}
