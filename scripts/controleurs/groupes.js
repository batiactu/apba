app.controller('GroupesCtrl', function ($scope, $log, $location, $route, GroupeFactory, $filter, $anchorScroll, $routeParams) {
    $scope.groupe = false;             // On initialise le groupe à false pour le remplir après
    $scope.groupes = false;            // On initialise les groupes à false pour les remplir après
    $scope.categories = false;          // On initialise les fabricants à false pour les remplir après
    $scope.nb_page = 0;                 // On initialise le nombre de page à 0 pour précsiser que c'est un entier
    $scope.ws = false;                  // On initialise le ws à false pour le remplir après
    $scope.factory = GroupeFactory;    // On donne à factory la valeur d'GroupeFactory (pour contenir tous les attributs et méthodes)
    $scope.$location = $location;       // Pour connaître la localisation de la page
    $scope.$log = $log;                 // Pour le debug
    $scope.Math = window.Math;

    /* Fonction retournant une valeur de type entier
     *  Paramètre : value, un élément qui n'est pas un entier
     *  Résultat : parseInt(value), value de type entier
     */
    $scope.int_val = function(value){
        return parseInt(value);
    }
    

    // Affecte $scope.groupes le contenu "items" des groupes et à $scope.ws toutes les data (items, facets...)
    GroupeFactory.getGroupes($scope.filter).then(function(data){
        $scope.groupes = data.items;
        $scope.categories = data.facets.categorie;
        $scope.ws = data;
    });
    GroupeFactory.getGroupes($routeParams.id).then(function(data){
        $scope.groupe = data[0];
    });

    /* Fonctions permettant de filtrer les groupes par :
     *  Keyword : search
     *  Pertinence/Date : switchDateAndRelevance
     *  Page : filterPage
     *  Categories : sortByCategories
     */
    // Fonction qui retourne tous les groupes contenant la valeur de filter (passé en paramètre)
    $scope.search = function(filter){
        if ($scope.filter.keywords==''){
            delete($scope.filter.keywords);
        }
        GroupeFactory.getGroupes(filter).then(function(data){
            $scope.groupes = data.items;
            $scope.ws = data;
        });
    }

    // Fonction qui retourne tous les groupes par ordre de date de publication ou pertinence
    $scope.switchDateAndRelevance = function(){
        $scope.filter.switch_label = ($scope.filter.sort_order_date_or_relevance==true)?'Pertinence':'Date';
        GroupeFactory.getGroupes($scope.filter).then(function(data){
            $scope.groupes = data.items;
            $scope.ws = data;
        });
    }

    // Fonction qui permet de filtrer par page
    $scope.filterPage = function(page){
        $scope.filter.page = page;
        GroupeFactory.getGroupes($scope.filter).then(function(data){
            $scope.groupes = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    //Fonction qui retourne tous les groupes par thème (passé en paramètre)
    $scope.sortByCategories= function(categorie){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.categorie=categorie;
        GroupeFactory.getGroupes($scope.filter).then(function(data){
            $scope.groupes = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    /* Fonctions retournant les éléments pour le menu toggle :
     *  Thèmes : getThemes
     *  Entity_type : getEntityTypes
     *  Rubriques : getRubriques
     *  Types de réalisation : getTypesRealisation
     *  Types de travaux : getTypesTravaux
     *  Fabricants : getFabricants
     */

    // Affecte à $scope.categories les data (les categories) obtenues par getCategories()
    GroupeFactory.getCategories().then(function(data){
        $scope.categories = data;
    });

    /* Fonction pour couper le texte et remplacer la fin par des pointillés
     *  Paramètres : text, le texte à couper. nbChar, le nombre de caractères à afficher
     *  Résultat : Le texte coupé avec des pointillés
     */
    $scope.fixText = function(text, nbChar){
        return text.substr(0,nbChar)+'...';
    }

    /* Fonction retournant les initiales d'un string
     *  Paramètre : string, une chaîne de caractère
     *  Traitement : On récupère les initiales de chaque mot et on les stocke dans un tableau des variables distinctes
     *  Retour : initales, une chaîne de caractère contenant toutes les initiales
     */
    $scope.getInitials = function(string){
        var initials = []
        for (i=0; i<string.split(' ').length;i++){
            initials.push(string.split(' ')[i].substr(0,1).toUpperCase()+'.');
        }
        // Si il y a 2 mots
        if (initials[1]!==undefined && initials[2]==undefined){
            return initials[0] + initials[1];
        }
        // Si il y a 3 mots
        else if (initials[1]!==undefined && initials[2]!==undefined){
            return initials[0] + initials[1] + initials[2];
        }
        // Si il y a 1 mot
        else return initials[0]; 
    }
})