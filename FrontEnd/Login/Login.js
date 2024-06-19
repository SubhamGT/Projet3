document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#loginForm');
    const emailInput = form.email;
    const passwordInput = form.password;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
  

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
                window.location.href = './../index.html';
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

   
});
