using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Events
{
    public static class EventGeoLocationFunction
    {
        [FunctionName("EventGeoLocationFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<EventInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-event-geolocation",
                Question = "In what range do you wanna get results?",
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "1 kilometer", Value = "1000"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "5 kilometer", Value = "5000"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "10 kilometer", Value = "10000"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "50 kilometer", Value = "50000"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepGeoLocationContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.Range = double.Parse(stepGeoLocationContext.Value);

            return await context.CallSubOrchestratorAsync<WizardResult>("EventDateRangeFunction", stepGeoLocationContext.Id, inputCriteria);
        }
    }
}
