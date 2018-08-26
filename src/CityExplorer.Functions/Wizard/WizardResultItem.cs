using System.Linq;
using CityExplorer.Functions.AmsterdamData;
using Newtonsoft.Json;

namespace CityExplorer.Functions.Wizard
{
    public class WizardResultItem
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("introduction")]
        public string Introduction { get; set; }
        [JsonProperty("image")]
        public string Image { get; set; }

        public static WizardResultItem From(ResultModel model)
        {
            return new WizardResultItem
            {
                Title = model?.Title,
                Introduction = model?.Details?.En?.ShortDescription,
                Image = model.Media?.FirstOrDefault()?.Url?.ToString() ?? string.Empty
            };
        }
    }
}
