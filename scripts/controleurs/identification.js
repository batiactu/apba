app.controller('IdentificationCtrl',  function ($scope){

    /* Pour l'identification : slider */
    var slides = $scope.slides = [];
        slides.push({
            icon:'fa-newspaper-o',
            image: 'images/image1.jpg',
            text: 'Des milliers d\'articles n\'attendent que vous',
            title: 'Découvrez les actualités et produits de Batiactu'
        });
        slides.push({
            icon:'fa-user-plus',
            image: 'images/image3.jpg',
            text: 'Connectez-vous et rencontrez des membres et leurs réalisations',
            title: 'Créez votre réseau'
        });
        slides.push({
            icon:'fa-briefcase',
            image: 'images/image7.jpg',
            text: 'Consultez, recherchez et sauvegardez les articles, produits et réalisations de Batiactu',
            title: 'Trouvez vos futurs travaux ou laissez-les vous trouver'
        });
        slides.push({
            icon:'fa-comments-o',
            image: 'images/image4.jpg',
            text: 'Commentez les articles ou réalisations et participez aux disscussions de Batiactu',
            title: 'Rendez-vous acteur de la communauté'
        });
        slides.push({
            icon:'fa-file-text-o',
            image: 'images/image5.jpg',
            text: 'Ouvrez la porte aux opportunités',
            title: 'Créez votre profil'
        });

    /* Pour la connexion et l'inscription */
    var connexion= $scope.connexion = [];
    connexion.push({
            image: 'images/image6.jpg'
    });

});