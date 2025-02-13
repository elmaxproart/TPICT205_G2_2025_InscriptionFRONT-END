namespace gradeManager.Models.AdministrationM.GestionAcademique
{
    using System.Text.Json.Serialization;

    public class UE
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("libelle")]
        public string Libelle { get; set; }

        [JsonPropertyName("coef")]
        public int Coef { get; set; }

        [JsonPropertyName("semestre")]
        public int Semestre { get; set; }
    }

}
