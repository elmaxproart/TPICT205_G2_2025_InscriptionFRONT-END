using gradeManager.Models.AdministrationM.GestionAcademique;
using System.Net.Http.Json;

namespace gradeManager.Service.inscription
{
    public class UEService:IUE
    {
        private readonly HttpClient _httpClient;

        public UEService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<UE>> GetAllUEsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<UE>>("https://localhost:7066/api/UE");
        }
    }
}
