using System;
using System.Threading.Tasks;
using CityExplorer.Functions.Wizard;
using Microsoft.Azure.WebJobs;

namespace CityExplorer.Functions.Events
{
    public static class EventDateRangeFunction
    {
        [FunctionName("EventDateRangeFunction")]
        public static async Task<WizardResult> GetResult(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var inputCriteria = context.GetInput<EventInputCriteria>();

            var wizardStep = new WizardStep
            {
                Id = Guid.NewGuid().ToString(),
                Event = "step-event-daterage",
                Question = "Which events do you want to find",
                IsLastQuestion = true,
                Answers = new[]
                {
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Passed events", Value = "PassedEvents"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "Upcoming events", Value = "UpcomingEvents"},
                    new Answer { Id = Guid.NewGuid().ToString(), Text = "All events", Value = "AllEvents"},
                }
            };

            context.SetCustomStatus(wizardStep);

            var stepDateRangeContext = await context.WaitForExternalEvent<Answer>(wizardStep.Event);

            inputCriteria.DateCriteria = stepDateRangeContext.Value;

            return await context.CallSubOrchestratorAsync<WizardResult>("GetEventResultFunction", stepDateRangeContext.Id, inputCriteria);
        }
    }
}
