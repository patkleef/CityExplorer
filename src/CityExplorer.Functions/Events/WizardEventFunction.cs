using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Events
{
    public static class WizardEventFunction
    {
        [FunctionName("WizardEventFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<EventInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-event",
                Question = "What kind of events do you like?",
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Music", Value = "music" },
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Multicultural", Value = "multicultural"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Comedy", Value = "comedy"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Art", Value = "art"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepFoodContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.Category = stepFoodContext.Text;

            return await context.CallSubOrchestratorAsync<WizardResult>("EventGeoLocationFunction", stepFoodContext.Id, inputCriteria);
        }
    }
}
