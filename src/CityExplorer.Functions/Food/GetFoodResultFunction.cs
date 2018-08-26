using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CityExplorer.Functions.AmsterdamData;
using CityExplorer.Functions.Wizard;
using GeoCoordinatePortable;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Food
{
    public static class GetFoodResult
    {
        [FunctionName("GetFoodResultFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var criteria = context.GetInput<FoodInputCriteria>();

            var items = await context.CallActivityAsync<IEnumerable<ResultModel>>("DataFunction", DataType.Food);

            items = items
                .Where(x => x.Details.En.LongDescription.Contains(criteria.Category))
                .Where(
                    x =>
                        x.Location != null &&
                        WithinDistance(x.Location.Latitude, x.Location.Longitude, criteria.VisitorCoordinates,
                            criteria.Range));

            var result = new WizardResult
            {
                Title = criteria.Key,
                Text = "Based on your interests we've found these results."
            };
            result.Items = items.Select(x => WizardResultItem.From(x));

            return result;
        }

        private static bool WithinDistance(double fromLatitude, double toLatitude, Coordinates to, double range)
        {
            if (fromLatitude == 0 || toLatitude == 0 || to == null)
            {
                return false;
            }
            var sCoord = new GeoCoordinate(fromLatitude, toLatitude);
            var eCoord = new GeoCoordinate(to.Latitude, to.Longitude);

            return sCoord.GetDistanceTo(eCoord) <= range;
        }
    }
}
