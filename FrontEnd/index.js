// ----------Etape1 appel de API avec la fonction fetch ---------------------------

document.addEventListener("DOMContentLoaded", function() {
    let galerie = document.querySelector('.gallery');
    console.log(galerie);

    let MesProjets = () => {
        fetch("http://localhost:5678/api/works")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                //Sert a cacher l'ancien html mais la plus besoin
                galerie.innerHTML = '';

                data.forEach(projet => {
                    let projetElement = document.createElement('div');
                    projetElement.className = 'projet';

                    let titre = document.createElement('h3');
                    titre.textContent = projet.title;
                    projetElement.appendChild(titre);

                    let description = document.createElement('p');
                    description.textContent = projet.description;
                    projetElement.appendChild(description);

                    if (projet.imageUrl) {
                        let image = document.createElement('img');
                        image.src = projet.imageUrl;
                        image.alt = projet.title;
                        projetElement.appendChild(image);
                    }

                    galerie.appendChild(projetElement);
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    MesProjets();
});
