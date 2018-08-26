using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Attraction;
using CityExplorer.Functions.Events;
using CityExplorer.Functions.Food;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Wizard
{
    public static class StartWizardFunction
    {
        [FunctionName("StartWizard")]
        public static async Task<WizardResult> Run([OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var coordinates = context.GetInput<Coordinates>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-1-answer",
                Question = "What else would you like to do?",
                Answers = new[]
                {
                    new Answer {Id = Guid.NewGuid().ToString(), Text = "Food", Value = "food"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Events", Value = "events" },
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Attractions", Value = "attractions" }
                }
            };

            context.SetCustomStatus(wizardStep);
            
            var step1Answer = await context.WaitForExternalEvent<Answer>(wizardStep.Event);
            
            WizardResult result = null;
            switch (step1Answer.Value)
            {
                case "food":
                    result = await context.CallSubOrchestratorAsync<WizardResult>("WizardFoodFunction", step1Answer.Id, new FoodInputCriteria { VisitorCoordinates = coordinates });
                    break;
                case "attractions":
                    result = await context.CallSubOrchestratorAsync<WizardResult>("WizardAttractionFunction", step1Answer.Id, new AttractionInputCriteria { VisitorCoordinates = coordinates });
                    break;
                case "events":
                    result = await context.CallSubOrchestratorAsync<WizardResult>("WizardEventFunction", step1Answer.Id, new EventInputCriteria { VisitorCoordinates = coordinates });
                    break;
            }
            return result;
        }
    }
}
