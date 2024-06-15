document.addEventListener("DOMContentLoaded", function() {
    let galerie = document.querySelector('.gallery');
    let galerieContainerModal = document.querySelector('.galerieContainer');
    let editModeMessage = document.getElementById('editModeMessage');

    const buttons = [
        { id: 'all', text: 'Tous', category: 'all' },
        { id: 'objects', text: 'Objets', category: 1 },
        { id: 'apartments', text: 'Appartements', category: 2 },
        { id: 'hotels', text: 'Hôtels & Restaurants', category: 3 }
    ];

    function createFilterButtons(buttons) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = button.id;
            btn.textContent = button.text;
            btn.setAttribute('data-category', button.category);
            buttonContainer.appendChild(btn);
        });

        document.getElementById('btnGroup').appendChild(buttonContainer);

        buttonContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                filterProjects(event.target.getAttribute('data-category'));
            }
        });
    }

    let fetchProjects = () => {
        return fetch("http://localhost:5678/api/works")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    };

    let displayProjects = (projects) => {
        galerie.innerHTML = '';

        projects.forEach(projet => {
            let projetElement = document.createElement('div');
            projetElement.className = 'projet';
            projetElement.setAttribute('data-id', projet.id);
            projetElement.setAttribute('data-category', projet.category.id);

            if (projet.imageUrl) {
                let imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';

                let image = document.createElement('img');
                image.src = projet.imageUrl;
                image.alt = projet.title;

                imageContainer.appendChild(image);
                projetElement.appendChild(imageContainer);
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

    let filterProjects = (category) => {
        let projects = document.querySelectorAll('.projet');
        projects.forEach(projet => {
            if (category === 'all' || projet.getAttribute('data-category') == category) {
                projet.style.display = 'block';
            } else {
                projet.style.display = 'none';
            }
        });
    };

    let displayMiniatures = (projects) => {
        galerieContainerModal.innerHTML = '';

        projects.forEach(projet => {
            let miniatureElement = document.createElement('div');
            miniatureElement.className = 'miniature';
            miniatureElement.setAttribute('data-id', projet.id);

            if (projet.imageUrl) {
                let image = document.createElement('img');
                image.src = projet.imageUrl;
                image.alt = projet.title;

                let deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button-miniature';
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                deleteButton.addEventListener('click', function() {
                    deleteProject(projet.id, miniatureElement);
                });

                miniatureElement.appendChild(image);
                miniatureElement.appendChild(deleteButton);
            }

            galerieContainerModal.appendChild(miniatureElement);
        });
    };

    let deleteProject = (projectId, miniatureElement) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            miniatureElement.remove();
            let imageToRemove = document.querySelector(`.gallery [data-id="${projectId}"]`);
            if (imageToRemove) {
                imageToRemove.remove();
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    fetchProjects()
        .then(data => {
            displayProjects(data);
            createFilterButtons(buttons);
            displayMiniatures(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    const loginLink = document.querySelector('#loginLink a');
    const token = localStorage.getItem('token');
    if (token) {
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'Login/index.html';
        });

        editModeMessage.style.display = 'block';
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'Login/index.html';
    }

    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('openModalButton');
    const closeButton = document.querySelector('.close');

    const openModal = () => {
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});
