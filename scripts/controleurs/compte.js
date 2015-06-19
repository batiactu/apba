app.controller('CompteCtrl', function ($scope, $log, $location, $route, CompteFactory, $filter, $anchorScroll) {
    $scope.factory = CompteFactory;     // On donne à factory la valeur de CompteFactory (pour contenir tous les attributs et méthodes)
    $scope.$location = $location;       // Pour connaître la localisation de la page
    $scope.$log = $log;                 // Pour le debug

console.log($location.path());
    
    $('#favoriInfoAdd').hide();
    $('#favoriInfoDelete').hide();

    var user_pref_theme = JSON.parse(localStorage.getItem("preferences_user_theme"));
    var user_pref_rubrique = JSON.parse(localStorage.getItem("preferences_user_rubrique"));
    var user_pref_type_real = JSON.parse(localStorage.getItem("preferences_user_type_real"));
    var user_pref_fabricant = JSON.parse(localStorage.getItem("preferences_user_fabricant"));
    if(user_pref_theme == null){
        user_pref_theme = {};
    }
    if(user_pref_rubrique == null){
        user_pref_rubrique = {};
    }
    if(user_pref_type_real == null){
        user_pref_type_real = {};
    }
    if(user_pref_fabricant == null){
        user_pref_fabricant = {};
    }
    $scope.pref_user.themes = user_pref_theme;
    $scope.pref_user.rubriques = user_pref_rubrique;
    $scope.pref_user.types_realisation = user_pref_type_real;
    $scope.pref_user.fabricants = user_pref_fabricant;
    

    
    // Affecte $scope.articles le contenu "items" des articles et à $scope.ws toutes les data (items, facets...)
    CompteFactory.getAllFacets().then(function(data){
        $scope.facets = data;
    });


    // Affecte à $scope.facets.themes les data (les thèmes) obtenues par getThemes() et passe au vert les thèmes favoris
    setTimeout(function() {
        if($location.path()=='/gestionFilActu'){
            angular.forEach($scope.pref_user.themes, function(value){
                //angular.element(document.querySelector('#th_1')).addClass("text-success");
                angular.element(document.querySelector('#'+value.id)).addClass("text-success");
                angular.element(document.querySelector('#span'+value.id)).addClass("fa fa-check");
            });
        }
    }, 1000);


    // Affecte à $scope.facets.rubriques les data (les rubriques) obtenues par getRubriques() et passe au vert les rubriques favoris
    setTimeout(function() {
        if($location.path()=='/gestionFilActu'){
            angular.forEach($scope.pref_user.rubriques, function(value){
                angular.element(document.querySelector('#'+value.id)).addClass("text-success");
                angular.element(document.querySelector('#span'+value.id)).addClass("fa fa-check");
            });
        }
    }, 1000);


    // Affecte à $scope.facets.types_realisation les data (les types_realisation) obtenues par getTypesRealisation() et passe au vert les types_realisation favoris
    setTimeout(function() {
        if($location.path()=='/gestionFilActu'){
            angular.forEach($scope.pref_user.types_realisation, function(value){
                angular.element(document.querySelector('#'+value.id)).addClass("text-success");
                angular.element(document.querySelector('#span'+value.id)).addClass("fa fa-check");
            });
        }
    }, 1000);


    // Affecte à $scope.facets.fabricants les data (les fabricants) obtenues par getFabricants() et passe au vert les fabricants favoris
    setTimeout(function() {
        if($location.path()=='/gestionFilActu'){
            angular.forEach($scope.pref_user.fabricants, function(value){
                angular.element(document.querySelector('#'+value.id)).addClass("text-success");
                angular.element(document.querySelector('#span'+value.id)).addClass("fa fa-check");
            });
        }
    }, 1000);

    /* Fonction permettant de trier des éléments par ordre alphabetique 
     *  Paramètres : a, b : des éléments à comparer, de type string
     *  Résultat : - -1, Si la chaine a est avant b (alphabetiquement parlant)
     *             - 0, Si la chaine a est comme b (alphabetiquement parlant)
     *             - 1, Si la chaine a est après b (alphabetiquement parlant)
     */
    $scope.triAlphabetique = function(a, b){
        if (a.name < b.name)
            return -1;
        else if (a.name == b.name)
            return 0;
        else
            return 1;
    }

    /* Fonction permettant de trier des éléments par ordre alphabetique 
     *  Paramètre : tabSource, un tableau contenant des string à comparer
        Traitement : On applique la fonction triAlphabetique à tabSource pour le ranger par ordre alphabétique
     *  Résultat : tabSourceAlpha, le tableau trié par ordre alphabétique
     */
    $scope.triFavoris = function(tabSource){
        if (tabSource== undefined || tabSource== false)
            return '';
        else{
            var tabSourceAlpha = tabSource.sort($scope.triAlphabetique);
            return tabSourceAlpha;
        }
    }

    /* Fonction permettant d'ajouter un thème aux thèmes favoris et changeant la couleur de ce thème
     *  Paramètres : theme, le thème à ajouter. index, la position de ce thème dans la liste des thèmes.
     *  Traitement : - On change la couleur du thème (de noir à vert ou de vert à noir)
     *               - On ajoute le thème à l'objet des préférences utilisateur s'il n'y est pas déjà. Sinon on le supprime
     *  Résultat : Aucun
     */
    $scope.addThemeToFav = function(theme, $index){
        // On change la couleur
        var id = 'th_'+$index;
        $('#'+id).toggleClass("text-success");
        $('#span'+id).toggleClass("fa-check");
        // On ajoute le thème à l'objet
        if (typeof $scope.pref_user.themes[theme] == 'undefined'){
            $scope.pref_user.themes[theme] = {'theme':theme, 'id':id};
            $('#favoriInfoAdd span').text('Le thème ' + theme);
            $('#favoriInfoAdd').fadeIn();
            setTimeout(function() {
                $('#favoriInfoAdd').fadeOut();
            }, 1000);
        }
        else{
            delete($scope.pref_user.themes[theme]);
            $('#favoriInfoDelete span').text('Le thème ' + theme);
            $('#favoriInfoDelete').fadeIn();
            setTimeout(function() {
                $('#favoriInfoDelete').fadeOut();
            }, 1000);
        }
        localStorage.setItem("preferences_user_theme",JSON.stringify($scope.pref_user.themes));
    }

    /* Fonction permettant d'ajouter une rubrique aux rubriques favorites et changeant la couleur de cette rubrique
     *  Paramètres : rubrique, la rubrique à ajouter. index, la position de cette rubrique dans la liste des rubriques.
     *  Traitement : - On change la couleur de la rubrique (de noir à vert ou de vert à noir)
     *               - On ajoute la rubrique à l'objet des préférences utilisateur si elle n'y est pas déjà. Sinon on la supprime
     *  Résultat : Aucun
     */
    $scope.addRubriqueToFav = function(rubrique, $index){
        // On change la couleur
        var id = 'rub_'+$index;
        $('#'+id).toggleClass("text-success");
        $('#span'+id).toggleClass("fa-check");
        // On ajoute la rubrique à l'objet
        if (typeof $scope.pref_user.rubriques[rubrique] == 'undefined'){
            $scope.pref_user.rubriques[rubrique] = {'rubrique':rubrique, 'id':id};
            $('#favoriInfoAdd span').text('La rubrique ' + rubrique);
            $('#favoriInfoAdd').fadeIn();
            setTimeout(function() {
                $('#favoriInfoAdd').fadeOut();
            }, 1000);
        }
        else{
            delete($scope.pref_user.rubriques[rubrique]);
            $('#favoriInfoDelete span').text('La rubrique ' + rubrique);
            $('#favoriInfoDelete').fadeIn();
            setTimeout(function() {
                $('#favoriInfoDelete').fadeOut();
            }, 1000);            
        }
        localStorage.setItem("preferences_user_rubrique",JSON.stringify($scope.pref_user.rubriques));
    }

    /* Fonction permettant d'ajouter un type_realisation aux types_realisation favoris et changeant la couleur de ce type_realisation
     *  Paramètres : type_real, le type_realisation à ajouter. index, la position de ce type_realisation dans la liste des types_realisation.
     *  Traitement : - On change la couleur du type_realisation (de noir à vert ou de vert à noir)
     *               - On ajoute le type_realisation à l'objet des préférences utilisateur s'il n'y est pas déjà. Sinon on le supprime
     *  Résultat : Aucun
     */
    $scope.addTypeRealToFav = function(type_real, $index){
        // On change la couleur
        var id = 'real_'+$index;
        $('#'+id).toggleClass("text-success");
        $('#span'+id).toggleClass("fa-check");
        // On ajoute le type de réalisation à l'objet
        if (typeof $scope.pref_user.types_realisation[type_real] == 'undefined'){
            $scope.pref_user.types_realisation[type_real] = {'type_real':type_real, 'id':id};
            $('#favoriInfoAdd span').text('Le type de réalisation ' + type_real);
            $('#favoriInfoAdd').fadeIn();
            setTimeout(function() {
                $('#favoriInfoAdd').fadeOut();
            }, 1000);
        }
        else{
            delete($scope.pref_user.types_realisation[type_real]);
            $('#favoriInfoDelete span').text('Le type de réalisation ' + type_real);
            $('#favoriInfoDelete').fadeIn();
            setTimeout(function() {
                $('#favoriInfoDelete').fadeOut();
            }, 1000);
        }
        localStorage.setItem("preferences_user_type_real",JSON.stringify($scope.pref_user.types_realisation));
    }

    /* Fonction permettant d'ajouter un fabricant aux fabricants favoris et changeant la couleur de ce fabricant
     *  Paramètres : fabricant, le fabricant à ajouter. index, la position de ce fabricant dans la liste des fabricants.
     *  Traitement : - On change la couleur du fabricant (de noir à vert ou de vert à noir)
     *               - On ajoute le fabricant à l'objet des préférences utilisateur s'il n'y est pas déjà. Sinon on le supprime
     *  Résultat : Aucun
     */
    $scope.addFabricantToFav = function(fabricant, $index){
        // On change la couleur
        var id = 'fab_'+$index;
        console.log(fabricant)
        $('#'+id).toggleClass("text-success");
        $('#span'+id).toggleClass("fa-check");
        // On ajoute le fabricant à l'objet
        if (typeof $scope.pref_user.fabricants[fabricant] == 'undefined'){
            $scope.pref_user.fabricants[fabricant] = {'fabricant':fabricant, 'id':id};
            $('#favoriInfoAdd span').text('Le fabricant ' + fabricant);
            $('#favoriInfoAdd').fadeIn();

            setTimeout(function() {
                $('#favoriInfoAdd').fadeOut();
            }, 1000);
        }
        else{
            delete($scope.pref_user.fabricants[fabricant]);
            $('#favoriInfoDelete span').text('Le fabricant ' + fabricant);
            $('#favoriInfoDelete').fadeIn();
            setTimeout(function() {
                $('#favoriInfoDelete').fadeOut();
            }, 1000);
        }
        localStorage.setItem("preferences_user_fabricant",JSON.stringify($scope.pref_user.fabricants));
    }

    $scope.deletePrefs = function(){
        localStorage.removeItem("preferences_user_theme");
        localStorage.removeItem("preferences_user_rubrique");
        localStorage.removeItem("preferences_user_type_real");
        localStorage.removeItem("preferences_user_fabricant");
    }
})