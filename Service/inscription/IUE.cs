using gradeManager.Models.AdministrationM.GestionAcademique;

namespace gradeManager.Service.inscription
{
    public interface IUE
    {
         Task<List<UE>> GetAllUEsAsync();
    }
}
