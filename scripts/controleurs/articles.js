app.controller('ArticlesCtrl', function ($scope, $log, $location, $route, ArticleFactory, cssInjector, $filter, $anchorScroll) {
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

    /* Routes accessibles pour les ng-if/ng-show*/
    $scope.accesBarreBasse = "$location.path()=='/' || $location.path()=='/actualites' || $location.path()=='/produits' || $location.path()=='/realisations' || $location.path()=='/compte' || $location.path()=='/groupes' || $location.path()=='/filactu' || $location.path()=='/gestionFilActu' || $location.path()=='/discussions' || $location.path()=='/gestion_realisations'";
    $scope.accesBarreHaute = "$location.path()=='/' || $location.path()=='/actualites' || $location.path()=='/produits' || $location.path()=='/realisations' || $location.path()=='/compte' || $location.path()=='/groupes' || $location.path()=='/filactu' || $location.path()=='/gestionFilActu'";
    $scope.accesMenuToggle = "$location.path()=='/' || $location.path()=='/actualites' || $location.path()=='/produits' || $location.path()=='/realisations'";
    $scope.accesFooter = "$location.path()!='/identification' && $location.path()!='/inscription' && $location.path()!='/connexion' && $location.path()!='/compte'";
    
    // Si l'on se trouve dans Home (/) sans mot après '/' alors on supprime l'entity_type
    if($location.path()=='/') 
        delete($scope.filter.entity_type);

    // Si l'on se trouve dans les actualités alors on supprime tous les filtres et on remet l'entity_type et le filtre par date
    if($location.path()=='/actualites'){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.entity_type='article_edito';
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
    }

    // Si l'on se trouve dans les produits alors on supprime tous les filtres et on remet l'entity_type et le filtre par date
    if($location.path()=='/produits'){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.entity_type='produitheque_produit';
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
    }

    // Si l'on se trouve dans les realisations alors on supprime tous les filtres et on remet l'entity_type et le filtre par date
    if($location.path()=='/realisations'){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.entity_type='reseau_realisation';
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
    }

    // Si l'on se trouve dans les groupes alors on supprime tous les filtres et on remet l'entity_type et le filtre par date
    if($location.path()=='/groupes'){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.entity_type='reseau_groupe';
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
    }

    // Si l'on se trouve dans les fabricants alors on supprime tous les filtres et on remet l'entity_type et le filtre par date
    if($location.path()=='/fabricants'){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.entity_type='produitheque_produit';
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
    }

    /* Si un entity_type est passé en paramètre, alors on redirige vers la page concernée */
    if ($location.path=='/' || $location.path=='/actualites' || $location.path=='/produits' || $location.path=='/realisations' || $location.path=='/groupes'){
        if ($scope.filter.entity_type=='article_edito') $location.path('/actualites');
        if ($scope.filter.entity_type=='produitheque_produit') $location.path('/produits');
        if ($scope.filter.entity_type=='reseau_realisation') $location.path('/realisations');
        if ($scope.filter.entity_type=='reseau_groupe') $location.path('/groupes');
    }

    /* Fonction retournant une valeur de type entier
     *  Paramètre : value, un élément qui n'est pas un entier
     *  Résultat : parseInt(value), value de type entier
     */
    $scope.int_val = function(value){
        return parseInt(value);
    }

    // Affecte $scope.articles le contenu "items" des articles et à $scope.ws toutes les data (items, facets...)
    ArticleFactory.getArticles($scope.filter).then(function(data){
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
        if ($scope.filter.keywords==''){
            delete($scope.filter.keywords);
        }
        ArticleFactory.getArticles(filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    // Fonction qui retourne tous les articles par ordre de date de publication ou pertinence
    $scope.switchDateAndRelevance = function(){
        $scope.filter.switch_label = ($scope.filter.sort_order_date_or_relevance==true)?'Pertinence':'Date';
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    // Fonction qui permet de filtrer par page
    $scope.filterPage = function(page){
        $scope.filter.page = page;
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    //Fonction qui retourne tous les articles par thème (passé en paramètre)
    $scope.sortByTheme = function(theme){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.theme=theme;
        $("#sidebar-wrapper").removeClass("active");
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    //Fonction qui retourne tous les articles par thème (passé en paramètre)
    $scope.sortByEntityType = function(entity_type){
        $scope.filter.entity_type=entity_type;
        $("#sidebar-wrapper").removeClass("active");
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    } 

    //Fonction qui retourne tous les articles par rubrique (passée en paramètre)
    $scope.sortByRubrique = function(rubrique){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.rubrique=rubrique;
        $("#sidebar-wrapper").removeClass("active");
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    //Fonction qui retourne tous les articles par type de réalisation (passée en paramètre)
    $scope.sortByTypeRealisation = function(type_realisation){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.type_realisation=type_realisation;
        $("#sidebar-wrapper").removeClass("active");
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    //Fonction qui retourne tous les articles par type de travaux (passée en paramètre)
    $scope.sortByTypeTravaux = function(type_travaux){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.type_travaux=type_travaux;
        $("#sidebar-wrapper").removeClass("active");
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.hash('top');
        $anchorScroll();
    }

    //Fonction qui retourne tous les articles par fabricant (passé en paramètre)
    $scope.sortByFabricants = function(fabricant){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.fabricant=fabricant;
        $("#sidebar-wrapper").removeClass("active");
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
            $location.hash('top');
        $anchorScroll();
        });
    }

    //Fonction qui retourne tous les groupes par catégorie (passée en paramètre)
    $scope.sortByCategories = function(categorie){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.categorie=categorie;
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
            $location.hash('top');
        });
        $location.hash('top');
        $anchorScroll();
        console.log($scope.filter)
    }

    /* Fonctions retournant les éléments pour le menu toggle :
     *  Thèmes : getThemes
     *  Entity_type : getEntityTypes
     *  Rubriques : getRubriques
     *  Types de réalisation : getTypesRealisation
     *  Types de travaux : getTypesTravaux
     *  Fabricants : getFabricants
     */

    // Affecte à $scope.menuToggle.themes les data (les thèmes) obtenues par getThemes()
    ArticleFactory.getThemes().then(function(data){
        $scope.menuToggle.themes = data;
    });

    // Affecte à $scope.menuToggle.rubriques les data (les rubriques) obtenues par getRubriques()
    ArticleFactory.getRubriques().then(function(data){
        $scope.menuToggle.rubriques = data;
    });

    // Affecte à $scope.menuToggle.types_realisation les data (les types_realisation) obtenues par getTypesRealisation()
    ArticleFactory.getTypesRealisation().then(function(data){
        $scope.menuToggle.types_realisation = data;
    });
    // Affecte à $scope.menuToggle.types_travaux les data (les types_travaux) obtenues par getTypesTravaux()
    ArticleFactory.getTypesTravaux().then(function(data){
        $scope.menuToggle.types_travaux = data;
    });
    // Affecte à $scope.menuToggle.fabricants les data (les fabricants) obtenues par getFabricants()
    ArticleFactory.getFabricants().then(function(data){
        $scope.menuToggle.fabricants = data;
    });

    /* Fonction permettant de supprimer un filtre selon la key et la value reçues
     *  Paramètres : - key, la clé du filtre (entity_type / sort_order_date / keyword...)
     *               - value, la valeur du filtre (article_edito / DESC / 'coucou')
     *  Traitement : - On supprime la clé du filtre (et donc la value)
     *               - On affecte data.items à $scope.articles, et data à $scope.ws (obtenus par getArticles)
     *               - On affecte data (tous les entity) à $scope.menuToggle.entity_type si l'on a supprimé l'entity_type
     *  Résultat : Aucun
     */
    $scope.removeFilter = function(key, value){
        delete ($scope.filter[key]);
        ArticleFactory.getArticles($scope.filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        ArticleFactory.getEntityTypes().then(function(data){
            $scope.menuToggle.entity_types = data;
        });
    }
    
    /* Fonction permettant de supprimer tous les filtres 
     *  Paramètres : Aucun
     *  Traitement : - On supprime le filtre
     *               - On affecte data.items à $scope.articles, et data à $scope.ws (obtenus par getArticles)
     *               - On rafraîchit la page
     *               - On affecte data (tous les entity) à $scope.menuToggle.entity_type
     *  Résultat : Aucun
     */
    $scope.removeAllFilters = function(filter){
        angular.forEach(filter, function(value, index){
            delete ($scope.filter[index]);
        });
        ArticleFactory.getArticles(filter).then(function(data){
            $scope.articles = data.items;
            $scope.ws = data;
        });
        $location.path('/');
        $route.reload();
        ArticleFactory.getEntityTypes().then(function(data){
            $scope.menuToggle.entity_types = data;
        });
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
        
    }

    /* Fonction permettant de changer d'entity_type
     *  Paramètre : unEntity, un entity_type
     *  Traitement : - On supprime tous les filtres
     *               - On ajoute les filtres désirés : l'entity passé en paramètre, le tri par date, le label date pour le bouton toggle
     *  Résultat : Aucun
    $scope.changeEntity = function(unEntity){
        angular.forEach($scope.filter, function(value, index){
            delete ($scope.filter[index]);
        });
        $scope.filter.entity_type=unEntity;
        $scope.filter.sort_order_date_or_relevance = false;
        $scope.filter.switch_label = 'Date';
    }
    */

    /* Fonction permettant de renvoyer un tableau vide
     * Paramètre : n, un entier
     * Résultat : Array(n), un tableau de dimension n.
     */
    $scope.repeteFakeArticles = function(n){
        return new Array(n);
    }

    /* Fonction pour couper le texte et remplacer la fin par des pointillés
     *  Paramètres : text, le texte à couper. nbChar, le nombre de caractères à afficher
     *  Résultat : Le texte coupé avec des pointillés
     */
    $scope.fixText = function(text, nbChar){
        return text.substr(0,nbChar)+'...';
    }

    $scope.URL = ArticleFactory.URL+'&DEBUG=1';             // Variable permettant de débugger
})