// Récup du token dans le local storage 
const token = localStorage.getItem('token');

// Pointer les éléments de l'HTML
const log = document.querySelector('#log a');
const modifierSection = document.getElementById('Modifier');
const galerie = document.querySelector('.gallery');
const galerieModale = document.querySelector('.galerieContainer');
const CreativeMode = document.getElementById('CreativeMode');

// ------------------------------------------------------------------------------Connexion------------------------------------------------------------------

// Si le token est présent, on est connecté
if (token) {
    log.textContent = 'Logout'; // Change le texte de login en logout
    log.addEventListener('click', function(event) { // Event pour logout
        event.preventDefault();
        localStorage.removeItem('token');   // Supprime le token du localStorage
        window.location.href = 'index.html'; // Redirige vers la page d'accueil
    });

    // Affiche le mode créatif et les sections de modification
    CreativeMode.style.display = 'block';
    modifierSection.style.display = 'block';
    btnGroup.style.display = 'none';
} else {
    log.textContent = 'Login'; // Change le texte en login
    log.href = 'Login/Login.html'; // Redirige vers la page login

    // Masque le mode créatif et les sections de modification
    CreativeMode.style.display = 'none';
    modifierSection.style.display = 'none';
    btnGroup.style.display = 'block';
}

// --------------------------------------------------------------------------------------Tableau Filter ----------------------------------------------------------

fetch("http://localhost:5678/api/categories", {
    method: 'GET', // Méthode GET pour récupérer les catégories
    headers: {
        'Authorization': `Bearer ${token}` // Ajout du token dans les headers
    }
})
.then(response => {
    if (!response.ok) { // Si la réponse n'est pas OK
        throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json(); // Transforme la réponse en JSON
})
.then(categories => {
    // Appel de la fonction pour créer les boutons de filtre
    createFilterButtons(categories);
})
.catch(error => {
    console.error('Erreur :', error);
});

function createFilterButtons(categories) {
    const buttonContainer = document.createElement('div'); // Conteneur des boutons
    buttonContainer.className = 'button-container';

    // Créer le bouton "Tous"
    const allBtn = document.createElement('button');
    allBtn.id = 'all';
    allBtn.textContent = 'Tous';
    allBtn.setAttribute('data-category', 'all'); // Attribut data-category pour "Tous"
    buttonContainer.appendChild(allBtn); // Ajouter le bouton "Tous" au conteneur

    // Créer les autres boutons à partir des catégories de l'API
    categories.forEach(category => {
        const btn = document.createElement('button'); // Crée un bouton pour chaque catégorie
        btn.id = category.id;
        btn.textContent = category.name; // Suppose que `name` est le nom de la catégorie
        btn.setAttribute('data-category', category.id); // Attribut data-category avec l'ID de la catégorie
        buttonContainer.appendChild(btn); // Ajouter le bouton au conteneur
    });

    document.getElementById('btnGroup').appendChild(buttonContainer); // Ajoute le conteneur de boutons au DOM

    // Event du filtre au click
    buttonContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') { // Vérifie que c'est bien un bouton
            filterProjects(event.target.getAttribute('data-category'));
        }
    });
}


// --------------------------------------Récupération des projets depuis l'API--------------------------------------------------------------------------------------------------------------

let fetchProjects = () => {
    return fetch("http://localhost:5678/api/works") // Récupération de l'API
        .then(response => {
            if (!response.ok) { // Si la réponse est différente de OK
                throw new Error('Erreur lors de la récupération des projets');
            }
            return response.json(); // Transforme la réponse en JSON
        });
};

// ---------------------------------------Affichage des projets dans la galerie------------------------------------------------------------------------------------------

let displayProjects = (projects) => {
    galerie.innerHTML = '';

    projects.forEach(projet => {
        let projetElement = document.createElement('div'); // Conteneur pour les projets
        projetElement.className = 'projet';
        projetElement.setAttribute('data-id', projet.id); // Stocke l'ID de chaque projet
        projetElement.setAttribute('data-category', projet.category.id);

        if (projet.imageUrl) { // Si le projet a une image
            let imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            let image = document.createElement('img');
            image.src = projet.imageUrl;
            image.alt = projet.title;

            imageContainer.appendChild(image); // Ajoute l'image au conteneur d'images
            projetElement.appendChild(imageContainer); // Ajoute le conteneur d'images au projet
        }

        let titre = document.createElement('h3');
        titre.textContent = projet.title;
        projetElement.appendChild(titre);

        let description = document.createElement('p');
        description.textContent = projet.description;
        projetElement.appendChild(description);

        galerie.appendChild(projetElement); // Ajoute le projet à la galerie
    });
};

//--------------------------------------------Filtrer les projets par catégorie  -----------------------------------------------------------------------------------------

let filterProjects = (category) => {
    let projects = document.querySelectorAll('.projet'); // Sélectionne tous les projets
    projects.forEach(projet => {
        if (category === 'all' || projet.getAttribute('data-category') == category)  {
            projet.style.display = 'block'; // Affiche les projets qui correspondent à la catégorie
        } else {
            projet.style.display = 'none'; // Masque les autres projets
        }
    });
};

//---------------------------------------------------------------Affichage des miniatures des projets dans la modale-----------------------------------------------------

let displayMiniatures = (projects) => {
    galerieModale.innerHTML = '';

    projects.forEach(projet => {
        let miniatureElement = document.createElement('div'); // Conteneur pour chaque miniature
        miniatureElement.className = 'miniature'; // Va chercher les propriétés CSS
        miniatureElement.setAttribute('data-id', projet.id); // Stocke l'ID de chaque miniature

        if (projet.imageUrl) { // Si le projet a une image
            let image = document.createElement('img');
            image.src = projet.imageUrl; // Affiche l'image de la galerie
            image.alt = projet.title;
            let deleteButton = document.createElement('button'); // Crée le bouton delete
            deleteButton.className = 'delete-button-miniature';
            deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteButton.addEventListener('click', function(event) {
                event.preventDefault(); 
                deleteProject(projet.id, miniatureElement); // Appel à la fonction delete
            });

            miniatureElement.appendChild(image); // Ajoute l'image à la miniature
            miniatureElement.appendChild(deleteButton); // Ajoute le bouton de suppression à la miniature
        }

        galerieModale.appendChild(miniatureElement); // Ajoute la miniature à la galerie modale
    });
};

//--------------------------------------------------Suppression des projets ------------------------------------

let deleteProject = (projectId, miniatureElement) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Spécifie que le contenu de la requête est au format JSON
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La réponse du réseau n\'était pas correcte');
        }
        miniatureElement.remove(); // Supprimer la miniature du DOM
        let imageToRemove = document.querySelector(`.gallery [data-id="${projectId}"]`);
        if (imageToRemove) {
            imageToRemove.remove(); // Supprimer l'image de la galerie
        }
    })
    .catch(error => {
        console.error('Problème avec le fetch', error);
    });
};

//--------------------------------------------Récupérer les projets et les afficher----------------------------------------------
fetchProjects()
    .then(data => {
        displayProjects(data); // Affiche les projets dans la galerie
        displayMiniatures(data); // Affiche les miniatures dans la modale
    })
    .catch(error => {
        console.error('Problème avec le fetch', error);
    });

//-----------------------------------------------------------------------------Création de la modal------------------------------------------------------------------------

//Sélection des éléments HTML->

const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModalButton');
const closeButton = document.querySelector('.close');

//Définition des fonctions d'ouverture et de fermeture:
const openModal = () => {
    modal.style.display = 'block';};
const closeModal = () => {
    modal.style.display = 'none';};
openModalButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);

//Ajout de l'event pour fermet
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

//Sélection des éléments HTML 

const addPhotoButton = document.getElementById('addPhotoButton');
const modalContent = document.querySelector('.modal-content');

//Event pour le btn ajout de photo

addPhotoButton.addEventListener('click', function() {
    const originalModalContent = modalContent.innerHTML;

    //Création de l'interface d'ajout de photo

    const addPhotoCont = document.createElement('div');
    addPhotoCont.id = 'addPhotoCont';

    const closeSpan = document.createElement('span');
    closeSpan.className = 'close';
    closeSpan.innerHTML = '<i class="fa-solid fa-x"></i>';
    closeSpan.addEventListener('click', closeModal);

    const addh3 = document.createElement('h3');
    addh3.id = 'addh3';
    addh3.textContent = 'Ajoute Photo';

    const dragImg = document.createElement('div');
    dragImg.id = 'DragImg';

    const dropArea = document.createElement('label');
    dropArea.id = 'drop-area';
    dropArea.setAttribute('for', 'input-file');

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/*';
    inputFile.id = 'input-file';
    inputFile.hidden = true;
    inputFile.classList.add('FormElement');

    const imgView = document.createElement('div');
    imgView.id = 'img-view';

    const imageIcon = document.createElement('i');
    imageIcon.className = 'fa-solid fa-image';

    const addButton = document.createElement('button');
    addButton.id = 'inputb';
    addButton.textContent = '+ Ajouter photo';

    const fileInfo = document.createElement('p');
    fileInfo.textContent = 'jpg.png: 4mo max'; //!!!!!!!!

    imgView.appendChild(imageIcon);
    imgView.appendChild(document.createElement('br'));
    imgView.appendChild(addButton);
    imgView.appendChild(fileInfo);

    dropArea.appendChild(inputFile);
    dropArea.appendChild(imgView);
    dragImg.appendChild(dropArea);

    const titleContainer = document.createElement('div');
    titleContainer.id = 'SelecteurContainer';

    const titleLabel = document.createElement('h5');
    titleLabel.textContent = 'Titre';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'titre';
    titleInput.placeholder = 'Entrez un titre';
    titleInput.classList.add('FormElement');

    titleContainer.appendChild(titleLabel);
    titleContainer.appendChild(titleInput);
//conteneur de titre et catégorie 

    const categoryContainer = document.createElement('div');
    categoryContainer.id = 'SelecteurContainer';

    const categoryLabel = document.createElement('h5');
    categoryLabel.textContent = 'Catégorie';

    const categorySelect = document.createElement('select');
    categorySelect.id = 'Categorie';
    categorySelect.classList.add('FormElement');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choisir une catégorie';
    defaultOption.disabled = true;
    defaultOption.selected = true;
//appel api 
    const option1 = document.createElement('option');
    option1.value = '1';
    option1.textContent = 'Objets';

    const option2 = document.createElement('option');
    option2.value = '2';
    option2.textContent = 'Appartements';

    const option3 = document.createElement('option');
    option3.value = '3';
    option3.textContent = 'Hôtel & Restaurants';
//
    categorySelect.appendChild(defaultOption);
    categorySelect.appendChild(option1);
    categorySelect.appendChild(option2);
    categorySelect.appendChild(option3);

    categoryContainer.appendChild(categoryLabel);
    categoryContainer.appendChild(categorySelect);

    const validateButton = document.createElement('input');
    validateButton.type = 'submit';
    validateButton.id = 'valider';
    validateButton.value = 'Valider';

//ajout des enfant au parent addPhotoCont

    addPhotoCont.appendChild(closeSpan);
    addPhotoCont.appendChild(addh3);
    addPhotoCont.appendChild(dragImg);
    addPhotoCont.appendChild(titleContainer);
    addPhotoCont.appendChild(categoryContainer);
    addPhotoCont.appendChild(validateButton);

    //Ajout des element dans le dom

    modalContent.innerHTML = '';
    modalContent.appendChild(addPhotoCont);

//---------------------------button de retour-------------------------

    const backButton = document.createElement('button');
    backButton.className = 'fa-solid fa-arrow-left back-button';
    backButton.addEventListener('click', function() {
        modalContent.innerHTML = originalModalContent;
//appel au fetch pour afficher les projets et les miniature
        fetchProjects()
            .then(data => {
                displayProjects(data);
                displayMiniatures(data);
                attachEventListeners(); // Réattacher les événements après avoir réinitialisé le contenu
            })
            .catch(error => {
                console.error('il y a un probleme sur le retour', error);
            });
    });

//Ajout du btn de retour
    modalContent.insertBefore(backButton, modalContent.firstChild);

    // Ajout de la vérification de complétion du formulaire
    inputFile.addEventListener('change', checkFormCompletion);
    titleInput.addEventListener('input', checkFormCompletion);
    categorySelect.addEventListener('change', checkFormCompletion);

   
   // Cette fonction vérifie si tous les champs du formulaire sont rempli
   
   function checkFormCompletion() {
        const file = inputFile.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

        if (file && title && category) {
            validateButton.classList.add('vertB');
        } else {
            validateButton.classList.remove('vertB');
        }
    }
//---------------------------------------Event au click sur valider btn----------
    validateButton.addEventListener('click', function(event) {
        event.preventDefault();
        const file = inputFile.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

 //condition vérifié sur les champ sont vide ou nn 
    if (!title || !category || !file) {
        alert("Veuillez remplir tous les champs et sélectionner une image.");
        return;//a tester
    }
   })


    function attachEventListeners() {
        // Attacher l'événement du bouton fermer
        const closeButton = document.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }
    
        // Attacher l'événement des boutons de suppression des photos
        const deleteButtons = document.querySelectorAll('.delete-button-miniature');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const projectId = button.parentElement.getAttribute('data-id');
                deleteProject(projectId, button.parentElement);
            });
        });
    
    
    
        // injecter la  section ajout de photos
        const addPhotoButton = document.getElementById('addPhotoButton');
        if (addPhotoButton) {
            addPhotoButton.addEventListener('click', function() {
                const originalModalContent = modalContent.innerHTML;
                const addPhotoCont = document.createElement('div');
                addPhotoCont.id = 'addPhotoCont';
    
                const closeSpan = document.createElement('span');
                closeSpan.className = 'close';
                closeSpan.innerHTML = '<i class="fa-solid fa-x"></i>';
                closeSpan.addEventListener('click', closeModal);
    
                const addh3 = document.createElement('h3');
                addh3.id = 'addh3';
                addh3.textContent = 'Ajoute Photo';
    
                const dragImg = document.createElement('div');
                dragImg.id = 'DragImg';
    
                const dropArea = document.createElement('label');
                dropArea.id = 'drop-area';
                dropArea.setAttribute('for', 'input-file');
    
                const inputFile = document.createElement('input');
                inputFile.type = 'file';
                inputFile.accept = 'image/*';
                inputFile.id = 'input-file';
                inputFile.hidden = true;
    
                const imgView = document.createElement('div');
                imgView.id = 'img-view';
    
                const imageIcon = document.createElement('i');
                imageIcon.className = 'fa-solid fa-image';
    
                const addButton = document.createElement('button');
                addButton.id = 'inputb';
                addButton.textContent = '+ Ajouter photo';
    
                const fileInfo = document.createElement('p');
                fileInfo.textContent = 'jpg.png: 4mo max';
    
                imgView.appendChild(imageIcon);
                imgView.appendChild(document.createElement('br'));
                imgView.appendChild(addButton);
                imgView.appendChild(fileInfo);
    
                dropArea.appendChild(inputFile);
                dropArea.appendChild(imgView);
                dragImg.appendChild(dropArea);
    
                const titleContainer = document.createElement('div');
                titleContainer.id = 'SelecteurContainer';
    
                const titleLabel = document.createElement('h5');
                titleLabel.textContent = 'Titre';
    
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.id = 'titre';
                titleInput.placeholder = 'Entrez un titre';
    
                titleContainer.appendChild(titleLabel);
                titleContainer.appendChild(titleInput);
    
                const categoryContainer = document.createElement('div');
                categoryContainer.id = 'SelecteurContainer';
    
                const categoryLabel = document.createElement('h5');
                categoryLabel.textContent = 'Catégorie';
    
                const categorySelect = document.createElement('select');
                categorySelect.id = 'Categorie';
    
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Choisir une catégorie';
                defaultOption.disabled = true;
                defaultOption.selected = true;
    //appel api
                const option1 = document.createElement('option');
                option1.value = '1';
                option1.textContent = 'Objets';
    
                const option2 = document.createElement('option');
                option2.value = '2';
                option2.textContent = 'Appartements';
    
                const option3 = document.createElement('option');
                option3.value = '3';
                option3.textContent = 'Hôtel & Restaurants';
    
                categorySelect.appendChild(defaultOption);
                categorySelect.appendChild(option1);
                categorySelect.appendChild(option2);
                categorySelect.appendChild(option3);
    
                categoryContainer.appendChild(categoryLabel);
                categoryContainer.appendChild(categorySelect);
    
                const validateButton = document.createElement('input');
                validateButton.type = 'submit';
                validateButton.id = 'valider';
                validateButton.value = 'Valider';
    
                addPhotoCont.appendChild(closeSpan);
                addPhotoCont.appendChild(addh3);
                addPhotoCont.appendChild(dragImg);
                addPhotoCont.appendChild(titleContainer);
                addPhotoCont.appendChild(categoryContainer);
                addPhotoCont.appendChild(validateButton);
    
                modalContent.innerHTML = '';
                modalContent.appendChild(addPhotoCont);

    //button de retour 

                const backButton = document.createElement('button');
                backButton.className = 'fa-solid fa-arrow-left back-button';
                backButton.addEventListener('click', function() {
                    modalContent.innerHTML = originalModalContent;
                    fetchProjects()
                        .then(data => {
                            displayProjects(data);
                            displayMiniatures(data);
                            attachEventListeners(); // Réattacher les événements après avoir réinitialisé le contenu
                        })
                        .catch(error => {
                            console.error('pas reussi a charger la modal', error);
                        });
                });
    
                modalContent.insertBefore(backButton, modalContent.firstChild);
    
                //Validation et soumission des donee du formulaire

                inputFile.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    //Vérifie que le fichier est bien défini
                    if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            imgView.innerHTML = '';
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.alt = 'Image';
                            imgView.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    }
                });
    
                validateButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    const file = inputFile.files[0];
                    const title = titleInput.value;
                    const category = categorySelect.value;
                
                    if (!title || !category || !file) {
                        alert("Veuillez remplir tous les champs et sélectionner une image.");
                        return;
                    }
                //Donée du formulaire
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('category', category);
                    formData.append('image', file);
                
                    const token = localStorage.getItem('token');
                    fetch("http://localhost:5678/api/works", {
                        method: 'POST',//c'est pour envoyé les données au serveur
                        headers: {
                            'Authorization': `Bearer ${token}`//ca permet au serveur de vérifier que la requette provient d'un utilisateur autorisé
                        },
                        //la requête contient les données a envoyer ici un objet FormData qui inclut le titre, la catégorie, et l'image du nouveau projet
                        body: formData 
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur');
                        }
                        return response.json();
                    })
                    //ajoute les projets ajouter dans la modal en mini et sur la page 
                    .then(newProject => {
                        fetchProjects()
                            .then(data => {
                                displayProjects(data);
                                displayMiniatures(data);
                      
                            })
                            .catch(error => {
                                console.error('err', error);
                            });
                    })
                    .catch(error => {
                        console.error('err', error);
                    });
                });
                
                
            });
        }
    }
    
    attachEventListeners();
    

    //btn retour
    modalContent.insertBefore(backButton, modalContent.firstChild);
    
    //---------------------------------------------------------------------------gestion du fichier d'image sélectionné dans ajouter photos-------------------------------------------------
    inputFile.addEventListener('change', function(event) {
        const file = event.target.files[0];

        //si tt les fichier sont bien définie 
        if (file && file.type.startsWith('image/')) {
    
            //reader pour lire le contenu du ficher     
            const reader = new FileReader();
            //onload veux dire lorceque ma page est charger tu m'affiche l'img dans ajout photos
            reader.onload = function(e) {
                imgView.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Image';
                imgView.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
    
    function attachEventHandlers() {
        // Reatacher l'événement du bouton fermer
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
    
        // Reatacher événement du bouton pour ajouter une photo
        const addPhotoButton = document.querySelector('.add-photo-button');
        if (addPhotoButton) {
            addPhotoButton.addEventListener('click', function() {
                // Logique pour aceder a ajout de photo
            });
        }
    }
    
    attachEventHandlers();
    
    addButton.addEventListener('click', function() {
        inputFile.click();
    });
//on a remis toute la logique de la fonction de validatebtn c'est quand on change de page 
    validateButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        const file = inputFile.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

        if (file && title && category) {
            validateButton.classList.add('vertB');
           
        }
     
    
        validateButton.classList.add('vertB');
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
                throw new Error('le form est pas valid');
            }
            return response.json();
        })
        .then(data => {
            addProjectToGallery(data);
            addProjectToMiniatures(data);
          alert("Le Projet a bien était ajouté")
        })
        .catch(error => {
            console.error('pas ta data', error);
        });
       
    });
   
});

//----------------------------------------------Cette fonction permet d'ajouter un projet à une galerie d'images sur la page web-----------------------------------------------
function addProjectToGallery(project) {
 
    let projetElement = document.createElement('div');
    projetElement.className = 'projet';
    projetElement.setAttribute('data-id', project.id);// Assigne un attribut de données avec l'ID du projet
    projetElement.setAttribute('data-category', project.categoryId); // Assigne un attribut de données avec l'ID de la catégorie

    // si projet a une URL d'image

    if (project.imageUrl) {
        let imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
// Création de l'image
        let image = document.createElement('img');
        image.src = project.imageUrl;
        image.alt = project.title;

  // Ajoute l'image au conteneur d'image, puis ajoute ce conteneur à l'élément du projet

        imageContainer.appendChild(image);
        projetElement.appendChild(imageContainer);
    }
//creation du titre et du p 
    let titre = document.createElement('h3');
    titre.textContent = project.title;
    projetElement.appendChild(titre);

    let description = document.createElement('p');
    description.textContent = project.description;
    projetElement.appendChild(description);
    galerie.appendChild(projetElement);
}

// Cette fonction ajoute un projet à une galerie de miniatures 

function addProjectToMiniatures(project) {
    let miniatureElement = document.createElement('div');
    miniatureElement.className = 'miniature';
    miniatureElement.setAttribute('data-id', project.id);

    if (project.imageUrl) {
        let image = document.createElement('img');
        image.src = project.imageUrl;
        image.alt = project.title;

        let deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button-miniature';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            deleteProject(project.id, miniatureElement);
        });

        miniatureElement.appendChild(image);
        miniatureElement.appendChild(deleteButton);
    }

    galerieModale.appendChild(miniatureElement);
}