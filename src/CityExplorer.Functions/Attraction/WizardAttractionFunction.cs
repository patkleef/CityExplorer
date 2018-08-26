using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Attraction
{
    public static class WizardAttractionFunction
    {
        [FunctionName("WizardAttractionFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<AttractionInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-attration",
                Question = "What would you like to visit?",
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Museum", Value = "museum" },
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Cinema", Value = "cinema"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Church", Value = "church"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Club", Value = "club"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepFoodContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.Category = stepFoodContext.Text;

            return await context.CallSubOrchestratorAsync<WizardResult>("AttractionGeoLocationFunction", stepFoodContext.Id, inputCriteria);
        }
    }
}
