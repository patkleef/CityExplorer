using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CityExplorer.Functions.AmsterdamData
{
    public class Resources
    {
        public string Language { get; set; }
        public string Title { get; set; }
        public string CalendarSummary { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
    }

    public class Details
    {
        public Resources De { get; set; }
        public Resources En { get; set; }
        public Resources Fr { get; set; }
        public Resources Nl { get; set; }
        public Resources It { get; set; }
        public Resources Es { get; set; }
    }

    public class SpecType
    {
        public string Type { get; set; }
        public string CatId { get; set; }
    }

    public class Location
    {
        public string Name { get; set; }
        public string City { get; set; }
        public string Adress { get; set; }
        public string Zipcode { get; set; }

        [JsonConverter(typeof(TestConverter))]
        public double Latitude { get; set; }

        [JsonConverter(typeof(TestConverter))]
        public double Longitude { get; set; }
    }

    public class TestConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return true;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.Value == null)
            {
                return 0;
            }
            return JsonConvert.DeserializeObject<double>(((string)reader.Value).Replace(",", "."));
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            writer.WriteValue(value.ToString());
        }
    }

    public class ResultModel
    {
        public string Trcid { get; set; }
        public string Title { get; set; }
        public Details Details { get; set; }
        public List<SpecType> Types { get; set; }
        public Location Location { get; set; }
        public List<string> Urls { get; set; }
        public List<ImageUrl> Media { get; set; }
        public DateCollection Dates { get; set; }
        public string Lastupdated { get; set; }
        public JContainer Eigenschappen { get; set; }
    }

    public class DateCollection
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<string> Singles { get; set; }
    }

    public class ImageUrl
    {
        public string Url { get; set; }
        public string Main { get; set; }
    }
}
