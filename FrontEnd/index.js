const token = localStorage.getItem('token');
const log = document.querySelector('#log a');
const modifierSection = document.getElementById('Modifier');
const galerie = document.querySelector('.gallery');
const galerieModale = document.querySelector('.galerieContainer');
const CreativeMode = document.getElementById('CreativeMode');

// le tocken c'est pour la connexion je lui dit si j'appuie sur logout tu m'enléve le tocken du localStorage

if (token) {
    log.textContent = 'Logout';
    log.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    CreativeMode.style.display = 'block';
    modifierSection.style.display = 'block';
    // sionon si j'appuie sur login tu me redirige sur la page de co 
} else {
    log.textContent = 'Login';
    log.href = 'Login/Login.html';

    CreativeMode.style.display = 'none';
    modifierSection.style.display = 'none';
}

//La c'est le button des filtre j'ai fait un tableau et je leur ai donner des categorie et des noms  pour les filtres 

const buttons = [
    { id: 'all', text: 'Tous', category: 'all' },
    { id: 'objects', text: 'Objets', category: 1 },
    { id: 'apartments', text: 'Appartements', category: 2 },
    { id: 'hotels', text: 'Hôtels & Restaurants', category: 3 }
];

//J'ai injecter une div et les button directement en Js 

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

//Fetch qui veux dire vas chercher la je sui aller chercher l'api qui me permet de montrer les img de projets

let fetchProjects = () => {
    return fetch("http://localhost:5678/api/works")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
//si j'ai bien compris return reponse est une promesse qui dit d'aller chercher l'api et de stocker la réponse
            return response.json();
        });
};

let displayProjects = (projects) => {
    //inerHtml me permet d'injecter du html 
    galerie.innerHTML = '';
//la j'ai fait la methode forEach qui veux dire pour chaque et la c'est pour injecter de nouvelle photos avec un titre id projets div
    projects.forEach(projet => {
        let projetElement = document.createElement('div');
        projetElement.className = 'projet';
        projetElement.setAttribute('data-id', projet.id);
        projetElement.setAttribute('data-category', projet.category.id);
//La j'ai crée la div qui me permet de stockeer les img 
        if (projet.imageUrl) {
            let imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            let image = document.createElement('img');
            image.src = projet.imageUrl;
            image.alt = projet.title;

            imageContainer.appendChild(image);
            projetElement.appendChild(imageContainer);
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
// La fonction foreach(pourchaque) ici pour le tableau des filtre sert a filtrer par rapport a leur category appartment objet hotel ou resto 
//  les 2 baton en bas  ||  ca sert a combiner deux condition en une seul c'est la logique ou 
let filterProjects = (category) => {
    let projects = document.querySelectorAll('.projet');
    projects.forEach(projet => {
        //la c'est juste pour tous
        if (category === 'all' || projet.getAttribute('data-category') == category) {
            projet.style.display = 'block';
        } else {
            projet.style.display = 'none';
        }
    });
};

//On a injecter dans la modal les img
let displayMiniatures = (projects) => {
    galerieModale.innerHTML = '';

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
            deleteButton.addEventListener('click', function(event) {
                event.preventDefault(); 
                deleteProject(projet.id, miniatureElement);
            });

            miniatureElement.appendChild(image);
            miniatureElement.appendChild(deleteButton);
        }

        galerieModale.appendChild(miniatureElement);
    });
};

//On est aller sur swager pour prendre l'api qui permet de supprimer les element de la base de donée et on a utiliser la metode delete pour supprimer enfaite
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

//Création de la modal

const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModalButton');
const closeButton = document.querySelector('.close');
const openModal = () => {
    modal.style.display = 'block';};
const closeModal = () => {
    modal.style.display = 'none';};

 openModalButton.addEventListener('click', openModal);

closeButton.addEventListener('click', closeModal);



window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

const addPhotoButton = document.getElementById('addPhotoButton');
const modalContent = document.querySelector('.modal-content');

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

    addPhotoCont.appendChild(closeSpan);
    addPhotoCont.appendChild(addh3);
    addPhotoCont.appendChild(dragImg);
    addPhotoCont.appendChild(titleContainer);
    addPhotoCont.appendChild(categoryContainer);
    addPhotoCont.appendChild(validateButton);

    modalContent.innerHTML = '';
    modalContent.appendChild(addPhotoCont);

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
                console.error('il y a un probleme je crois', error);
            });
    });
    modalContent.insertBefore(backButton, modalContent.firstChild);

    // Ajout de la vérification de complétion du formulaire
    inputFile.addEventListener('change', checkFormCompletion);
    titleInput.addEventListener('input', checkFormCompletion);
    categorySelect.addEventListener('change', checkFormCompletion);

   

    modalContent.insertBefore(backButton, modalContent.firstChild);

    inputFile.addEventListener('change', checkFormCompletion);
    titleInput.addEventListener('input', checkFormCompletion);
    categorySelect.addEventListener('change', checkFormCompletion);

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

    validateButton.addEventListener('click', function(event) {
        event.preventDefault();
        const file = inputFile.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

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
                            console.error('il y a un probleme je crois', error);
                        });
                });
    
                modalContent.insertBefore(backButton, modalContent.firstChild);
    
                inputFile.addEventListener('change', function(event) {
                    const file = event.target.files[0];
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
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur');
                        }
                        return response.json();
                    })
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
    

    
    modalContent.insertBefore(backButton, modalContent.firstChild);
    
    inputFile.addEventListener('change', function(event) {
        const file = event.target.files[0];
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
    
        // Réattacher les événements des boutons de suppression des images
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const image = button.closest('.image');
                if (image) {
                    const imageId = image.getAttribute('data-id');
                    fetch(`/api/delete-image/${imageId}`, {
                        method: 'DELETE',
                    })
                    .then(response => {
                        if (response.ok) {
                            image.remove();
                        } else {
                            console.error('Erreur lors de la suppression de l\'image');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur API:', error);
                    });
                }
            });
        });
    }
    
    attachEventHandlers();
    


    
    addButton.addEventListener('click', function() {
        inputFile.click();
    });

    validateButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        const file = inputFile.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

        if (file && title && category) {
            console.log('aa');
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
                throw new Error('Jai pas ton api');
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

function addProjectToGallery(project) {
    console.log(project);
    let projetElement = document.createElement('div');
    projetElement.className = 'projet';
    projetElement.setAttribute('data-id', project.id);
    projetElement.setAttribute('data-category', project.categoryId);

    if (project.imageUrl) {
        let imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        let image = document.createElement('img');
        image.src = project.imageUrl;
        image.alt = project.title;

        imageContainer.appendChild(image);
        projetElement.appendChild(imageContainer);
    }

    let titre = document.createElement('h3');
    titre.textContent = project.title;
    projetElement.appendChild(titre);

    let description = document.createElement('p');
    description.textContent = project.description;
    projetElement.appendChild(description);
    galerie.appendChild(projetElement);
}

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
