using Newtonsoft.Json;

namespace CityExplorer.Functions.Wizard
{
    public class Answer
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("value")]
        public string Value { get; set; }
    }
}
