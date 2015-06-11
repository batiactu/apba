app.controller('FilActuCtrl', function ($scope, $log, $location, $route, ArticleFactory, $filter, $anchorScroll) {
    $scope.articles = false;            // On initialise les articles à false pour les remplir après
    $scope.themes = false;              // On initialise les thèmes à false pour les remplir après
    $scope.entity_types = false;        // On initialise les entity types à false pour les remplir après
    $scope.rubriques = false;           // On initialise les rubriques à false pour les remplir après
    $scope.types_realisation = false;   // On initialise les types de réalisation à false pour les remplir après
    $scope.types_travaux = false;       // On initialise les types de travaux à false pour les remplir après
    $scope.fabricants = false;          // On initialise les fabricants à false pour les remplir après
    $scope.nb_page = 0;                 // On initialise le nombre de page à 0 pour leprécsiser que c'est un entier
    $scope.ws = false;                  // On initialise le ws à false pour le remplir après
    $scope.factory = ArticleFactory;    // On donne à factory la valeur d'ArticleFactory (pour contenir tous les attributs et méthodes)
    $scope.$location = $location;       // Pour connaître la localisation de la page
    $scope.$log = $log;                 // Pour le debug
    $scope.Math = window.Math;
    $scope.filter2 = {};
    
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

    /* Fonction retournant une valeur de type entier
     *  Paramètre : value, un élément qui n'est pas un entier
     *  Résultat : parseInt(value), value de type entier
     */
    $scope.int_val = function(value){
        return parseInt(value);
    }

    /* Pour afficher uniquement les articles relatifs aux préférences de l'utilisateur*/
        // Thèmes
        var first = true;
        angular.forEach(user_pref_theme, function(value){
            if(first){
                $scope.filter2.manual='sm_theme:' + value.theme;
            }
            else{
                $scope.filter2.manual+=' OR sm_theme:' + value.theme;
            }
            first=false;
        });
        // Rubriques
        angular.forEach(user_pref_rubrique, function(value){
            if(first){
                $scope.filter2.manual='sm_rubrique:' +value.rubrique;
            }
            else{
                $scope.filter2.manual+=' OR sm_rubrique:' +value.rubrique;

            }
            first=false;
        });
        // Types Realisation
        angular.forEach(user_pref_type_real, function(value){
            if(first){
                $scope.filter2.manual='ss_type_real:' + value.type_real;
            }
            else{
                $scope.filter2.manual+=' OR ss_type_real:' + value.type_real;
            }
            first=false;
        });
        //Fabricants
        angular.forEach(user_pref_fabricant, function(value){
            if(first){
                $scope.filter2.manual='ss_indus:' + value.fabricant;
            }
            else{
                $scope.filter2.manual+=' OR ss_indus:' + value.fabricant;
            }
            first=false;
        });

    // Affecte $scope.articles le contenu "items" des articles et à $scope.ws toutes les data (items, facets...)
    ArticleFactory.getArticles($scope.filter2).then(function(data){
        $scope.articles = data.items;
        $scope.facets = data.facets;
        $scope.ws = data;
    });

    /* Fonctions permettant de filtrer les articles par :
     *  Keyword : search
     *  Pertinence/Date : switchDateAndRelevance
     *  Page : filterPage
     *  Thème : sortByTheme
     *  Entity_type : sortByEntityType
     *  Rubrique : sortByRubrique
     *  Type de réalisation : sortByTypeRealisation
     *  Type de travaux : sortByTypesTravaux
     *  Fabricants : sortByFabricants 
     */
    // Fonction qui retourne tous les articles contenant la valeur de filter (passé en paramètre)
    $scope.search = function(filter){
        if ($scope.filter2.keywords==''){
            delete($scope.filter2.keywords);
        }
        ArticleFactory.getArticles(filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
    }

    // Fonction qui retourne tous les articles par ordre de date de publication ou pertinence
    $scope.switchDateAndRelevance = function(){
        $scope.filter2.switch_label = ($scope.filter2.sort_order_date_or_relevance==true)?'Pertinence':'Date';
        ArticleFactory.getArticles($scope.filter2).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
    }

    // Fonction qui permet de filtrer par page
    $scope.filterPage = function(page){
        console.log(page)
        $scope.filter2.page = page;
        ArticleFactory.getArticles($scope.filter2).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }
   
    /* Fonction permettant de renvoyer un tableau vide
     * Paramètre : n, un entier
     * Résultat : Array(n), un tableau de dimension n.
     */
    $scope.repeteFakeArticles = function(n){
        return new Array(n);
    }

     

})