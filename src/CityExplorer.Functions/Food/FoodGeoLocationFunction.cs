using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Food
{
    public static class FoodGeoLocationFunction
    {
        [FunctionName("FoodGeoLocationFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<FoodInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-geolocation",
                Question = "In which range do you want to get results?",
                IsLastQuestion = true,
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "100 meter", Value = "100"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "500 meter", Value = "500"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "2 kilometer", Value = "2000"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "5 kilometer", Value = "5000"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepGeoLocationContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.Range = double.Parse(stepGeoLocationContext.Value);

            return await context.CallSubOrchestratorAsync<WizardResult>("GetFoodResultFunction", stepGeoLocationContext.Id, inputCriteria);
        }
    }
}
