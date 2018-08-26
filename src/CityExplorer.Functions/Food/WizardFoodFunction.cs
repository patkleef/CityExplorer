using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Food
{
    public static class WizardFoodFunction
    {
        [FunctionName("WizardFoodFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<FoodInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-food",
                Question = "What kind of food do you like?",
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "American", Value = "american" },
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Italian", Value = "italian"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Greek", Value = "greek"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Chinese", Value = "chinese"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepFoodContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.Category = stepFoodContext.Text;

            return await context.CallSubOrchestratorAsync<WizardResult>("FoodGeoLocationFunction", stepFoodContext.Id, inputCriteria);
        }
    }
}