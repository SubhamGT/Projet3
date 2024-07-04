    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    console.log('Token avant récupération :', localStorage.getItem('token'));

  
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

     //Voir si le mail est le mm que sur l'api
        const email = emailInput.value;
        const password = passwordInput.value;

       
        emailError.textContent = '';
        passwordError.textContent = '';

     
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
           
            if (data.userId && data.token) {
                // Stocker mon tocken,
                localStorage.setItem('token', data.token); 

                console.log('Token après connexion :', localStorage.getItem('token')); 

                // si j'ai le tocken envoie moi sur la page principal stp
                window.location.href = './../index.html';
            } else {
           
                emailError.textContent = "Mail ou mot de passe Incorect.";
                passwordError.textContent = "Mail ou mot de passe Incorect.";
            }
        })
        .catch(error => {
           
            console.error('Y a un probléme avec la co', error);
            emailError.textContent = "Mail ou mot de passe Incorect.";
            passwordError.textContent = "Mail ou mot de passe Incorect.";
        });
    });

