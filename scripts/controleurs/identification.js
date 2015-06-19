app.controller('IdentificationCtrl',  function ($scope, $location){
    $scope.user={email:'', password:''}



    /* Pour chaque slide, on insère dans un tableau toutes ses informations  :
     *  icon : le font-awesome du slide
     *  image : l'image de fond du slide
     *  text : le texte secondaire du slide
     *  title : le texte principal du slide
    */
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

    // Pour la connexion et l'inscription on procède de la même manière que pour l'identification, mais seulement avec l'image car il n'y a qu'un slide
    var connexion = $scope.connexion = [];
    connexion.push({
            image: 'images/image6.jpg'
    });

    $scope.image_connexion = 'images/image6.jpg';

    $scope.identification = function(){
        //Appeler le WS
        var retourWS = {etat:'OK', info_user:{name:'Federer', firstname:'Roger'}};

        // WS renvoie OK : on est connecté
        if (retourWS.etat=='OK'){
            $scope.user.nom = retourWS.info_user.name;
            $scope.user.prenom = retourWS.info_user.firstname;
            $scope.user.isConnected = true;
            localStorage.setItem("user",JSON.stringify($scope.user));
            $location.path('/')
        }
        // WS renvoie non : On reste sur la page et message erreur
        else{
            $("#erreur-connexion").removeClass("hide");
        }
        

    }

});