using System.Collections.Generic;
using Newtonsoft.Json;

namespace CityExplorer.Functions.Wizard
{
    public class WizardResult
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("items")]
        public IEnumerable<WizardResultItem> Items { get; set; }
    }
}
