app.controller('RealisationsCtrl', function ($scope, $log, $location, $route, RealisationFactory, $filter, $anchorScroll) {
    $scope.articles = false;            // On initialise les articles à false pour les remplir après
    $scope.types_realisation = false;   // On initialise les types de réalisation à false pour les remplir après
    $scope.types_travaux = false;       // On initialise les types de travaux à false pour les remplir après
    $scope.factory = RealisationFactory;    // On donne à factory la valeur de RealisationFactory (pour contenir tous les attributs et méthodes)
    $scope.$location = $location;       // Pour connaître la localisation de la page
    $scope.$log = $log;                 // Pour le debug
    
    // Pour le mois du datepicker de l'ajout d'une réalisation
    $scope.listeMois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

    /* Fonction permettant de récupérer toutes les années de 2000 à l'année courante
     *  Paramètre : Aucun
     *  Traitement : On récupère l'année courante et pour chaque année jusqu'à l'an 2000, on ajoute l'année dans un tableau.
     *  Résultat : newTab, le tableau contenant toutes les années de l'année courante à 2000.
     */
    var changeAnnee = function(){
        var anneeCourante = new Date().getFullYear();
        var newTab = [];
        for (i=anneeCourante;i>=2000; i--){
            newTab.push(i);
        }
        return newTab;
    }
    $scope.listeAnnees = changeAnnee();

    // Affecte $scope.articles le contenu "items" des articles et à $scope.ws toutes les data (items, facets...)
    RealisationFactory.getArticles($scope.filter).then(function(data){
        $scope.articles = data.items;
        $scope.facets = data.facets;
        $scope.ws = data;
    });

    // Affecte à $scope.menuToggle.types_realisation les data (les types_realisation) obtenues par getTypesRealisation()
    RealisationFactory.getTypesRealisation().then(function(data){
        $scope.menuToggle.types_realisation = data;
    });
    // Affecte à $scope.menuToggle.types_travaux les data (les types_travaux) obtenues par getTypesTravaux()
    RealisationFactory.getTypesTravaux().then(function(data){
        $scope.menuToggle.types_travaux = data;
    });
    
    
})