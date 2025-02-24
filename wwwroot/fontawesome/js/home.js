 
   
        function openLoginModal() {
            document.getElementById("loginModal").style.display = "flex";
        document.getElementById("registerModal").style.display = "none";
    }

        function closeLoginModal() {
            document.getElementById("loginModal").style.display = "none";
    }

        function openRegisterModal() {
            document.getElementById("registerModal").style.display = "flex";
        document.getElementById("loginModal").style.display = "none";
    }

        function closeRegisterModal() {
            document.getElementById("registerModal").style.display = "none";
    }



        // Ajout d'un écouteur d'événement sur le bouton de connexion
        document.getElementById('loginButton').addEventListener('click', function(e) {
            e.preventDefault(); // Empêche le comportement par défaut, si nécessaire

        // Ici, vous pouvez ajouter une validation des champs avant de lancer le chargement

        // Affiche le spinner de chargement
        document.getElementById('loginLoader').style.display = 'block';

        // Optionnel : masquer le bouton pour éviter plusieurs clics
        this.style.display = 'none';

        // Simuler un délai de chargement (par exemple 3 secondes)
        setTimeout(function() {
            // Ici, vous pouvez intégrer votre logique d'authentification,
            // par exemple en envoyant une requête au serveur.

            // Une fois le traitement terminé, cachez le spinner et réaffichez le bouton
            document.getElementById('loginLoader').style.display = 'none';
        document.getElementById('loginButton').style.display = 'block';

        // Par exemple, fermer la modale en cas de succès
        closeLoginModal();
        }, 3000); // délai de 3000 ms (3 secondes)
    });

 
    // Fonction de connexion de l'utilisateur
    async function loginUser() {
        const email = document.querySelector("#loginModal input[type='email']").value;
        const password = document.querySelector("#loginModal input[type='password']").value;

        const response = await fetch("https://localhost:7066/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            alert("Échec de connexion. Vérifiez vos identifiants.");
            return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); // Stocker le token

        // Récupérer le rôle de l'utilisateur
        const userRole = await getUserRole(data.token);

        // Redirection en fonction du rôle
        if (userRole === "Admin") {
            window.location.href = "/admin-dashboad";
        } else {
            window.location.href = "/student-dashboard";
        }
    }

// Fonction pour obtenir le rôle de l'utilisateur à partir du token
async function getUserRole(token) {
    const response = await fetch("https://localhost:7066/api/auth/userRole", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) {
        console.error("Impossible de récupérer le rôle.");
        return "User";
    }

    const data = await response.json();
    return data.role;
}

// Vérifier si l'utilisateur est déjà connecté en vérifiant le token
function checkUserAuthentication() {
    const token = localStorage.getItem("token");
    if (!token) {
        // Rediriger l'utilisateur vers la page d'accueil s'il n'est pas connecté
        window.location.href = "/Home.razor"; // Remplacez par votre page de connexion si nécessaire
    }
}

// Vérification de la connexion à chaque chargement de la page
window.onload = checkUserAuthentication;

// Ajouter l'événement au bouton de connexion
document.querySelector("#loginModal button").addEventListener("click", loginUser);



       async function loginUser() {
        const email = document.querySelector("#loginModal input[type='email']").value;
        const password = document.querySelector("#loginModal input[type='password']").value;

        const response = await fetch("https://localhost:7066/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            alert("Échec de connexion. Vérifiez vos identifiants.");
            return;
        }

        const data = await response.json();

        // Vérifier si l'utilisateur a activé 2FA
        const requires2FA = data.message === "Veuillez vérifier votre e-mail pour le code 2FA.";

        if (requires2FA) {
            // Sauvegarder l'email dans localStorage pour l'auto-remplir
            localStorage.setItem("pendingEmail", email);

            // Rediriger vers la page de vérification 2FA
            window.location.href = "/verify-2fa";
        } else {
            // Stocker le token si pas de 2FA
            localStorage.setItem("token", data.token);
            document.cookie = "isAuthenticated=true; path=/"; // Cookie pour éviter le 2FA à chaque connexion

            // Récupérer le rôle de l'utilisateur
            const userRole = await getUserRole(data.token);

            // Redirection selon le rôle
            if (userRole === "Admin") {
                window.location.href = "/admin-dashboard";
            } else {
                window.location.href = "/student-dashboard";
            }
        }
    }

    // Vérification du cookie lors du chargement de la page
    function checkUserAuthentication() {
        const token = localStorage.getItem("token");
        const isAuthenticated = document.cookie.includes("isAuthenticated=true");

        if (!token || !isAuthenticated) {
            // Rediriger vers la page de connexion
            window.location.href = "/Home.razor";
        }
    }

    // Fonction de déconnexion (supprime le cookie et le token)
    function logout() {
        localStorage.removeItem("token");
        document.cookie = "isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/Home.razor";
    }

    window.onload = checkUserAuthentication;
    document.querySelector("#loginModal button").addEventListener("click", loginUser);


    //verify 2fA
        document.addEventListener("DOMContentLoaded", function () {
        const emailField = document.querySelector("#email");
        emailField.value = localStorage.getItem("pendingEmail") || ""; // Auto-remplissage de l'email
    });

    // Fonction pour vérifier le code 2FA
    async function verify2FA() {
        const email = document.querySelector("#email").value;
        const code = document.querySelector("#code2fa").value;

        const response = await fetch("https://localhost:7066/api/auth/verify-2fa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, code })
        });

        if (!response.ok) {
            alert("Code 2FA incorrect ou expiré !");
            return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        document.cookie = "isAuthenticated=true; path=/"; // Stockage du cookie

        // Récupérer le rôle et rediriger
        const userRole = await getUserRole(data.token);
        if (userRole === "Admin") {
            window.location.href = "/admin-dashboard";
        } else {
            window.location.href = "/dashboard";
        }
    }


        async function registerUser() {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const nickName = document.getElementById("nickName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const passwordError = document.getElementById("passwordError");

        // Vérification des mots de passe
        if (password !== confirmPassword) {
            passwordError.style.display = "block";
            return;
        } else {
            passwordError.style.display = "none";
        }

        // Objet utilisateur à envoyer à l'API
        const userData = {
            firstName,
            lastName,
            nickName,
            email,
            password
        };

        try {
            const response = await fetch("https://localhost:7066/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("Échec de l'inscription : " + (errorData.message || "Erreur inconnue"));
                return;
            }

            alert("Inscription réussie ! Connectez-vous.");
            closeRegisterModal();
            openLoginModal();
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert("Une erreur est survenue. Vérifiez votre connexion.");
        }
    }

    // Ajout d'un écouteur d'événement pour le bouton d'inscription
    document.querySelector('.btn-submit').addEventListener('click', function (event) {
        event.preventDefault(); // Empêcher la soumission du formulaire par défaut
        registerUser();
    });

    // Fonction pour fermer la modal d'inscription
    function closeRegisterModal() {
        document.getElementById("registerModal").style.display = "none";
    }

    // Fonction pour ouvrir la modal de connexion
    function openLoginModal() {
        document.getElementById("registerModal").style.display = "none";
        document.getElementById("loginModal").style.display = "block"; // Assurez-vous que `loginModal` existe dans votre HTML
    }



