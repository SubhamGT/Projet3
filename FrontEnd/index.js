document.addEventListener("DOMContentLoaded", function() {
    let galerie = document.querySelector('.gallery');

    // Récupère les projets depuis l'API
    let fetchProjects = () => {
        return fetch("http://localhost:5678/api/works")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    };

    // Affiche les projets dans la galerie
    let displayProjects = (projects) => {
        galerie.innerHTML = '';

        projects.forEach(projet => {
            let projetElement = document.createElement('div');
            projetElement.className = 'projet';
            projetElement.setAttribute('data-id', projet.id);
            projetElement.setAttribute('data-category', projet.category); // Ajoute la catégorie pour le filtrage

            if (projet.imageUrl) {
                let image = document.createElement('img');
                image.src = projet.imageUrl;
                image.alt = projet.title;
                projetElement.appendChild(image);
            }

            let titre = document.createElement('h3');
            titre.textContent = projet.title;
            projetElement.appendChild(titre);

            let description = document.createElement('p');
            description.textContent = projet.description;
            projetElement.appendChild(description);

            galerie.appendChild(projetElement);
        });
    };

    // Filtre les projets en fonction de la catégorie
    let filterProjects = (category) => {
        let projects = document.querySelectorAll('.projet');
        projects.forEach(projet => {
            if (category === 'all' || projet.getAttribute('data-category') === category) {
                projet.style.display = 'block';
            } else {
                projet.style.display = 'none';
            }
        });
    };

    fetchProjects()
        .then(data => {
            // Ajoutez des catégories aux projets
            data.forEach(projet => {
                // Ajoutez ici une logique pour déterminer la catégorie en fonction de l'id ou d'autres attributs
                if ([1, 5].includes(projet.id)) {
                    projet.category = 'objects';
                } else if ([2, 4, 6, 7, 8, 9].includes(projet.id)) {
                    projet.category = 'apartments';
                } else if ([3,  10, 11].includes(projet.id)) {
                    projet.category = 'hotels';
                } else {
                    projet.category = 'all';
                }
            });

            displayProjects(data);

            // Ajoute les écouteurs d'événements aux boutons de filtre
            document.getElementById('all').addEventListener('click', () => filterProjects('all'));
            document.getElementById('objects').addEventListener('click', () => filterProjects('objects'));
            document.getElementById('apartments').addEventListener('click', () => filterProjects('apartments'));
            document.getElementById('hotels').addEventListener('click', () => filterProjects('hotels'));
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});