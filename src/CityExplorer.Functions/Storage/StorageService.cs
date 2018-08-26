using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace CityExplorer.Functions.Storage
{
    public class StorageService : IStorageService
    {
        private readonly string _containerName = "sources";

        private CloudStorageAccount _storageAccount => 
            CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("AzureWebJobsStorage"));
        
        public CloudBlockBlob GetBlob(string fileName)
        {
            var cloudBlobClient = _storageAccount.CreateCloudBlobClient();

            var container = cloudBlobClient.GetContainerReference(_containerName);

            return container.GetBlockBlobReference(fileName);
        }
    }
}
