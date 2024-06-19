
document.addEventListener("DOMContentLoaded", function() {
    const tokens = localStorage.getItem('token');
console.log('Token actuel :', tokens); // Vérifie le contenu du localStorage après récupération
const loginLink = document.querySelector('#loginLink a');
const modifierSection = document.getElementById('Modifier');

if (tokens) {
    // Si un token est présent, change le texte du lien en "Logout"
    loginLink.textContent = 'logout';
    // Ajoute un gestionnaire d'événements pour la déconnexion lorsque l'utilisateur clique sur "Logout"
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Supprime le token du localStorage
        localStorage.removeItem('token');
        console.log('Token après déconnexion :', localStorage.getItem('token')); // Vérifie le contenu du localStorage après déconnexion
        // Redirige vers la page de connexion
        window.location.href = 'Login/Login.html';
    });
    // Si l'utilisateur est connecté, affichez la section "Modifier"
    modifierSection.style.display = 'block';
} 
    const galerie = document.querySelector('.gallery');
    const galerieContainerModal = document.querySelector('.galerieContainer');
    const editModeMessage = document.getElementById('editModeMessage');
  

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

   
    const token = localStorage.getItem('token');
    if (token) {
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'Login/Login.html';
        });

        editModeMessage.style.display = 'block';
        modifierSection.style.display = 'block';
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'Login/Login.html';

        // cacher les mode
        editModeMessage.style.display = 'none';
        modifierSection.style.display = 'none';
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

    // ------------------------------AjouterPhoto------------------------------------------------/

    const addPhotoButton = document.getElementById('addPhotoButton');
    const modalContent = document.querySelector('.modal-content');
    const AjoutPhotos = fetch('http://localhost:5678/api/works');
    addPhotoButton.addEventListener('click', function() {
        const originalModalContent = modalContent.innerHTML;

        modalContent.innerHTML = `
            <div id="addPhotoCont">
                <span class="close">
                    <i class="fa-solid fa-x"></i>
                </span>
                <h3 id="addh3">Ajoute Photo</h3>
                <div id="DragImg">
                    <label for="input-file" id="drop-area">
                        <input type="file" accept="image/*" id="input-file" hidden>
                        <div id="img-view">
                            <i class="fa-solid fa-image"></i><br>
                            <button id="inputb">+ Ajouter photo</button>
                            <p>jpg.png: 4mo max</p>
                        </div>
                    </label>
                </div>
                <div>
                    <div id="SelecteurContainer">
                        <h5>Titre</h5>
                        <input type="text" id="titre" placeholder="Entrez un titre">
                    </div>
                    <div id="SelecteurContainer">
                        <h5>Catégorie</h5>
                        <select id="Categorie">
                            <option value="" selected disabled>Choisir une catégorie</option>
                            <option value="1">Objets</option>
                            <option value="2">Appartements</option>
                            <option value="3">Hôtel & Restaurants</option>
                        </select>
                    </div>
                </div>
                <input type="submit" id="valider" value="Valider">
            </div>
        `;

        const backButton = document.createElement('button');
        backButton.className = 'fa-solid fa-arrow-left back-button';
        backButton.addEventListener('click', function() {
            modalContent.innerHTML = originalModalContent; //faire un create element
            
            fetchProjects()
                .then(data => {
                    displayProjects(data);
                    displayMiniatures(data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        });

        modalContent.insertBefore(backButton, modalContent.firstChild);

        // Ajout du gestionnaire d'événements pour fermer le modal lorsqu'on clique sur le span avec la classe close
        modalContent.querySelector('.close').addEventListener('click', closeModal);

        document.getElementById('input-file').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgView = document.getElementById('img-view');
                    imgView.innerHTML = `<img src="${e.target.result}" alt="Image">`;
                }
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('inputb').addEventListener('click', function() {
            document.getElementById('input-file').click();
        });

        document.getElementById('valider').addEventListener('click', function() {
            const fileInput = document.getElementById('input-file');
            const titleInput = document.getElementById('titre');
            const categoryInput = document.getElementById('Categorie');
            const file = fileInput.files[0];
            const title = titleInput.value;
            const category = categoryInput.value;

            if (!file || !title || !category) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('title', title);
            formData.append('category', category);

            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayProjects([data]);
                displayMiniatures([data]);
                closeModal();

                document.getElementById('valider').classList.add('filled');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
    });
});
