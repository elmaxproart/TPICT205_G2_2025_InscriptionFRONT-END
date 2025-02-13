namespace gradeManager.Service.google
{
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    public class TranslationService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public TranslationService(HttpClient httpClient, string apiKey)
        {
            _httpClient = httpClient;
            _apiKey = apiKey;
        }

        public async Task<string> TranslateText(string text, string targetLanguage)
        {
            var url = $"https://translation.googleapis.com/language/translate/v2?key={_apiKey}";

            var requestBody = new
            {
                q = text,
                target = targetLanguage,
                format = "text"
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(jsonResponse);
            return result.data.translations[0].translatedText;
        }
    }
}
