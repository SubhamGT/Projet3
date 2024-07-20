
// -----------------------------------------------------------------Selecteur du dom (document object model)--------------------------------------------------

//Récup du tocken dans le local storage 
const token = localStorage.getItem('token');

// Pointer les element de l'html
const log = document.querySelector('#log a');
const modifierSection = document.getElementById('Modifier');
const galerie = document.querySelector('.gallery');
const galerieModale = document.querySelector('.galerieContainer');
const CreativeMode = document.getElementById('CreativeMode');


// ------------------------------------------------------------------------------Conexion------------------------------------------------------------------


// si le tocken est la on est connecté
if (token) {
    log.textContent = 'Logout'; //change le text de login en logout
    log.addEventListener('click', function(event) { //event pour logout
        event.preventDefault();
        localStorage.removeItem('token');   //suprime le tocken du localstorage
        window.location.href = 'index.html'; //lien pour aller sur la page d'acceuil
    });

//affiche créatives mode et modification

    CreativeMode.style.display = 'block';
    modifierSection.style.display = 'block';

    // sionon si j'appuie sur login tu me redirige sur la page de co 

} else {
    log.textContent = 'Login'; //change le texte en login
    log.href = 'Login/Login.html';//redirige sur la page login

    //masque le créative mode et modification

    CreativeMode.style.display = 'none';
    modifierSection.style.display = 'none';
    btnGroup.style.display = 'none';
}


// --------------------------------------------------------------------------------------Tableau Filter ----------------------------------------------------------


//Tableau [] des buttons de filtre et leur categori

const buttons = [
    { id: 'all', text: 'Tous', category: 'all' },
    { id: 'objects', text: 'Objets', category: 1 },
    { id: 'apartments', text: 'Appartements', category: 2 },
    { id: 'hotels', text: 'Hôtels & Restaurants', category: 3 }
];

//fonction pour créer les butons filter

function createFilterButtons(buttons) {
    const buttonContainer = document.createElement('div'); //conteneur du button
    buttonContainer.className = 'button-container';

    buttons.forEach(button => {
        const btn = document.createElement('button'); //crée un button pouyr chaque entré
        btn.id = button.id;
        btn.textContent = button.text;
        btn.setAttribute('data-category', button.category);
        buttonContainer.appendChild(btn); //ajoute le button au contenur
    });

    document.getElementById('btnGroup').appendChild(buttonContainer); // Ajoute le conteneur de boutons au DOM


    //event du filtre au click
    buttonContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {//Verifie que c'est bien un btn
            filterProjects(event.target.getAttribute('data-category'));
        }
    });


}
// --------------------------------------// récupére les projets depuis l'api--------------------------------------------------------------------------------------------------------------

//api veux dire application progamming interface
let fetchProjects = () => { //methode fetch veux dire vas chercher la l'api 
    return fetch("http://localhost:5678/api/works") //Recup de l'api via (Swagger offre des outils permettant de générer la documentation pour son API Web)
        .then(response => {
            if (!response.ok) {
                throw new Error('erreur');
            }

            return response.json();//Envoie moi la réponse en format JSOn
        });
};


// ---------------------------------------Fonction pour afficher les projets dans la galerie------------------------------------------------------------------------------------------


let displayProjects = (projects) => {
    galerie.innerHTML = '';

    projects.forEach(projet => {
        let projetElement = document.createElement('div');//Conteneur pour projets
        projetElement.className = 'projet';
        projetElement.setAttribute('data-id', projet.id);
        projetElement.setAttribute('data-category', projet.category.id);

        if (projet.imageUrl) { //si le projet a une img
            let imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            let image = document.createElement('img');
            image.src = projet.imageUrl;
            image.alt = projet.title;

            imageContainer.appendChild(image); //ajout d'image au conteur d'img
            projetElement.appendChild(imageContainer);// Ajoute le conteneur d'image au projet
        }
// avec leur titre et leur paragraphe 
        let titre = document.createElement('h3');
        titre.textContent = projet.title;
        projetElement.appendChild(titre);

        let description = document.createElement('p');
        description.textContent = projet.description;
        projetElement.appendChild(description);


        galerie.appendChild(projetElement); 
    });
};


//--------------------------------------------fontion pour filtrer les projets par catégorie  -----------------------------------------------------------------------------------------


let filterProjects = (category) => {
    let projects = document.querySelectorAll('.projet'); // Sélectionne tout les projets
    projects.forEach(projet => {
        if (category === 'all' || projet.getAttribute('data-category') == category)  {
            projet.style.display = 'block';//affiche les projets qui correspond a la categorie 
        } else {
            projet.style.display = 'none';//masque les autres projets
        }
    });
};


//---------------------------------------------------------------Fontion pour afficher les miniature des projets dans la modal-----------------------------------------------------


let displayMiniatures = (projects) => {
    galerieModale.innerHTML = '';

    projects.forEach(projet => {
        let miniatureElement = document.createElement('div'); //conteneur pour chaques miniature
        miniatureElement.className = 'miniature'; // vax chercher les propriété css
        miniatureElement.setAttribute('data-id', projet.id);//permet de stocker l'id de chaque miniature du projet

        if (projet.imageUrl) { //si le projet a une img 
            let image = document.createElement('img');
            image.src = projet.imageUrl; //affiche l'img de la galerie 
            image.alt = projet.title;
            let deleteButton = document.createElement('button');// crée le btn delete
            deleteButton.className = 'delete-button-miniature';
            deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteButton.addEventListener('click', function(event) {
                event.preventDefault(); 
                deleteProject(projet.id, miniatureElement); // appel a la fonction delete
            });

            miniatureElement.appendChild(image);// Ajoute l'image à la miniature
            miniatureElement.appendChild(deleteButton);// Ajoute le bouton de suppression à la miniature
        }

        galerieModale.appendChild(miniatureElement);// Ajoute la miniature à la galerie modale
    });
};

//--------------------------------------------------fonction qui permet de delete les projets ------------------------------------
let deleteProject = (projectId, miniatureElement) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' //spécifie que le contenu de la requête est au format JSON
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La réponse du réseau n\'était pas correcte');
        }
        miniatureElement.remove(); //supprimer la miniature du DOM
        let imageToRemove = document.querySelector(`.gallery [data-id="${projectId}"]`);
        if (imageToRemove) {
            imageToRemove.remove(); //Supprimer l'img de la galerie
        }
    })
    .catch(error => {
        console.error('y a un problem avec le fetch', error);
    });
};
//--------------------------------------------Récupre les projets depuis l'api et les affiche dans la galerie et la modale----------------------------------------------
fetchProjects()
    .then(data => {
        displayProjects(data); // fonction prend les données récupérées data et les affiche dans la galerie elle pourrait parcourir les projets et créer des éléments DOM pour les afficher.
        createFilterButtons(buttons); //fonction crée des boutons de filtre
        displayMiniatures(data);//fonction prend également les données récupérées data et les affiche sous forme de miniatures dans une modale.
    })
    .catch(error => {
        console.error('il y a un probléme avec le fetch', error);
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
        return;
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