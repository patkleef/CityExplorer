using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace CityExplorer.Functions
{
    public static class HttpStartFunction
    {
        public static class HttpStart
        {
            [FunctionName("HttpStart")]
            public static async Task<HttpResponseMessage> Run(
                [HttpTrigger(AuthorizationLevel.Anonymous, methods: "post", Route = "orchestrators/{functionName}")] HttpRequestMessage req,
                [OrchestrationClient] DurableOrchestrationClientBase starter,
                string functionName,
                ILogger log)
            {
                dynamic eventData = await req.Content.ReadAsAsync<object>();
                string instanceId = await starter.StartNewAsync(functionName, eventData);

                var res = starter.CreateCheckStatusResponse(req, instanceId);
                res.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(10));
                return res;
            }
        }
    }
}
