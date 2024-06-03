document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#loginForm');

    form.email.addEventListener('change', function() {
        validEmail(this);
    });

    form.password.addEventListener('change', function() {
        validPassword(this);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Empêche la soumission du formulaire et le changement de page

        let emailInput = form.email;
        let passwordInput = form.password;

        let isEmailValid = validEmail(emailInput);
        let isPasswordValid = validPassword(passwordInput);

        if (isEmailValid && isPasswordValid) {
            console.log('Formulaire valide - redirection');
            window.location.href = 'http://127.0.0.1:5500/FrontEnd/index.html'; // Redirection si les identifiants sont corrects
        } else {
            console.log('Formulaire invalide - vérifier les entrées');
        }
    });

    const validEmail = function(inputEmail) {
        const validEmail = 'sophie.bluel@test.tld';
        let small = inputEmail.nextElementSibling;

        if (inputEmail.value === validEmail) {
            if (small) {
                small.innerHTML = "Adresse Valide";
                small.classList.remove('text-danger');
                small.classList.add('text-success');
            }
            return true;
        } else {
            if (small) {
                small.innerHTML = "Adresse Non Valide";
                small.classList.remove('text-success');
                small.classList.add('text-danger');
            }
            return false;
        }
    };

    const validPassword = function(inputPassword) {
        const validPassword = 'S0phie';
        let small = inputPassword.nextElementSibling;

        if (inputPassword.value === validPassword) {
            if (small) {
                small.innerHTML = "Mot de passe Valide";
                small.classList.remove('text-danger');
                small.classList.add('text-success');
            }
            return true;
        } else {
            if (small) {
                small.innerHTML = "Mot de passe Non Valide";
                small.classList.remove('text-success');
                small.classList.add('text-danger');
            }
            return false;
        }
    };
});