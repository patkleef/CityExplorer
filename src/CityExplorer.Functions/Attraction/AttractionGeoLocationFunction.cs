using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Attraction
{
    public static class AttractionGeoLocationFunction
    {
        [FunctionName("AttractionGeoLocationFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<AttractionInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-attraction-geolocation",
                Question = "In what range do you wanna get results?",
                IsLastQuestion = true,
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "500 meter", Value = "100"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "2 kilometer", Value = "2000"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "5 kilometer", Value = "5000"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "10 kilometer", Value = "10000"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepGeoLocationContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.Range = double.Parse(stepGeoLocationContext.Value);

            return await context.CallSubOrchestratorAsync<WizardResult>("GetAttractionResultFunction", stepGeoLocationContext.Id, inputCriteria);
        }
    }
}
