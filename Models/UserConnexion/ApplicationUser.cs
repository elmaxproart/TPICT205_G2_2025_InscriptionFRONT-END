using Microsoft.AspNetCore.Identity;

namespace gradeManager.Models.UserConnexion
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        
    }
}
