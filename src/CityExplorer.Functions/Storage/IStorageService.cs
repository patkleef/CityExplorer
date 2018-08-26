using Microsoft.WindowsAzure.Storage.Blob;

namespace CityExplorer.Functions.Storage
{
    public interface IStorageService
    {
        CloudBlockBlob GetBlob(string fileName);
    }
}