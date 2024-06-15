document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#loginForm');
    const emailInput = form.email;
    const passwordInput = form.password;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginLink = document.querySelector('#loginLink a');
    const modifierSection = document.getElementById('Modifier');

    console.log('Token avant récupération :', localStorage.getItem('token')); // Vérifie le contenu du localStorage avant récupération

    // Écouteur d'événement pour la soumission du formulaire
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Empêche la soumission du formulaire et le changement de page

        // Récupération des données saisies par l'utilisateur
        const email = emailInput.value;
        const password = passwordInput.value;

        // Envoi de la requête POST à l'API pour se connecter
        fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Vérification si l'API a renvoyé un userId et un token
            if (data.userId && data.token) {
                // Stockage du token dans le localStorage
                localStorage.setItem('token', data.token);

                console.log('Token après connexion :', localStorage.getItem('token')); // Vérifie le contenu du localStorage après connexion

                // Redirection vers la page principale
                window.location.href = 'http://127.0.0.1:5500/FrontEnd/index.html';
            } else {
                // Affichage d'un message d'erreur
                emailError.textContent = "Adresse email ou mot de passe incorrect.";
                passwordError.textContent = "Adresse email ou mot de passe incorrect.";
            }
        })
        .catch(error => {
            // Gestion des erreurs de connexion
            console.error('There was a problem with the fetch operation:', error);
            emailError.textContent = "Adresse email ou mot de passe incorrect.";
            passwordError.textContent = "Adresse email ou mot de passe incorrect.";
        });
        
    });

    const token = localStorage.getItem('token');
    console.log('Token actuel :', token); // Vérifie le contenu du localStorage après récupération

    if (token) {
        // Si un token est présent, change le texte du lien en "Logout"
        loginLink.textContent = 'logout';
        // Ajoute un gestionnaire d'événements pour la déconnexion lorsque l'utilisateur clique sur "Logout"
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Supprime le token du localStorage
            localStorage.removeItem('token');
            console.log('Token après déconnexion :', localStorage.getItem('token')); // Vérifie le contenu du localStorage après déconnexion
            // Redirige vers la page de connexion
            window.location.href = 'Login/index.html';
        });
        // Si l'utilisateur est connecté, affichez la section "Modifier"
        modifierSection.style.display = 'block';
    } 
});
