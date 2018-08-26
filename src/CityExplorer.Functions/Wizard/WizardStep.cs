using System.Collections.Generic;
using Newtonsoft.Json;

namespace CityExplorer.Functions.Wizard
{
    public class WizardStep
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("question")]
        public string Question { get; set; }
        [JsonProperty("answers")]
        public IEnumerable<Answer> Answers { get; set; }
        [JsonProperty("event")]
        public string Event { get; set; }
        [JsonProperty("isLastQuestion")]
        public bool IsLastQuestion { get; set; }
    }
}
