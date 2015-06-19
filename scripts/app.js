var app = angular.module('myapp', ['ngRoute', 'ngSanitize', 'angular.css.injector', 'toggle-switch', 'ui.bootstrap', 'ngTouch']);
/* Fonction permettant de rediriger vers les fichiers HTML correspondant à chaque ancre et éventuellement y ajouter un controller*/
app.config(function($routeProvider){
    $routeProvider
        .when('/', {templateUrl : 'views/home.html', controller: 'ArticlesCtrl'})
        .when('/articles/:id', {templateUrl : 'views/article.html', controller:'ArticleDetailsCtrl'})
        .when('/articles/:id/:page', {templateUrl : 'views/article.html', controller:'ArticleDetailsCtrl'})
        .when('/contact', {templateUrl : 'views/contact.html'})
        .when('/connexion', {templateUrl : 'views/connexion.html', controller:'IdentificationCtrl'})
        .when('/identification', {templateUrl : 'views/identification.html', controller:'IdentificationCtrl'})
        .when('/fabricants', {templateUrl : 'views/fabricants.html', controller:'FabricantsCtrl'})
        .when('/inscription', {templateUrl : 'views/inscription.html', controller:'IdentificationCtrl'})
        .when('/filactu', {templateUrl : 'views/filactu.html', controller:'FilActuCtrl'})
        .when('/compte', {templateUrl : 'views/compte.html', controller:'CompteCtrl'})
        .when('/gestionFilActu', {templateUrl : 'views/gestionFilActu.html', controller:'CompteCtrl'})
        .when('/photos', {templateUrl : 'views/photos.html', controller:'ArticlesCtrl'})
        .when('/discussions', {templateUrl : 'views/discussions.html', controller:'ArticlesCtrl'})
        .when('/new_discussion', {templateUrl : 'views/new_discussion.html', controller:'ArticlesCtrl'})
        .when('/gestion_realisations', {templateUrl : 'views/realisations.html', controller:'ArticlesCtrl'})
        .when('/ajout_realisation', {templateUrl : 'views/realisations/ajout_realisation.html', controller:'RealisationsCtrl'})
        .when('/mes_realisations', {templateUrl : 'views/realisations/mes_realisations.html', controller:'RealisationsCtrl'})
        .when('/realisations_preferees', {templateUrl : 'views/realisations/mes_realisations_preferees.html', controller:'RealPrefCtrl'})
        .when('/groupes', {templateUrl : 'views/groupes.html', controller:'GroupesCtrl'})
        .when('/profil', {templateUrl : 'views/profil.html', controller:'ArticlesCtrl'}) // Changer le contrôleur
        /* Pour accéder plus rapidement aux différents entity_type */
        .when('/actualites', {templateUrl : 'views/home.html', controller:'ArticlesCtrl'})
        .when('/produits', {templateUrl : 'views/home.html', controller:'ArticlesCtrl'})
        .when('/realisations', {templateUrl : 'views/home.html', controller:'ArticlesCtrl'})
        .when('/enCoursDeveloppement', {templateUrl : 'views/enCoursDeveloppement.html'})
        .when('/parametres_appli', {templateUrl : 'views/parametres_appli.html'})
        .when('/conditions', {templateUrl : 'views/conditions.html'})
        .when('/propos', {templateUrl : 'views/propos.html'})
        .otherwise({redirectTo : '/'}); // Si ce qui suit "/" n'est pas défini plus haut alors on redirige vers "/" (home.html)
    });
/* Fonction exécutée au chargement du site */
app.run(function($rootScope, $location, ConfigFactory) {
    $rootScope.filter = {"sort_order_date_or_relevance":false, switch_label:'Date'};   // On initialise le filtre avec par défaut les actualités en entity_type
    $rootScope.config = {};                                 // On initialise la configuration, pour la traduction 
    $rootScope.menuToggle = {};                             // On initialise le contenu des filtres du menu toggle
    $rootScope.config.loader = false;                       // On initialise le loader à faux (passe à vrai quand chargement)
    $rootScope.pref_user = {'themes':{}, 'rubriques':{}, 'types_realisation':{}, 'fabricants':{}};
    $rootScope.realisations_preferees = {};

    // Fonction pour la traduction
    ConfigFactory.getTrad().then(function(data){
        $rootScope.config.trad = data;
    });
})

/* Fonction pour la pagination */
app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=1; i<=total; i++)
            input.push(i);
        return input;
    };
});

/* Fonction pour changer le CSS selon l'entity_type de l'élément
 *  Si aucun entity_type n'est passé, alors on renvoie commun.min, qui est une partie du nom du fichier CSS
 */

app.filter('getCSS', function() {
    return function(input) {
        if (typeof input == 'undefined'){
            return 'commun.min';
        }
        else{
            return input
        }
    };
});

/* Fonction pour remplacer les caractères spéciaux */
app.filter('replaceCharacter', function() {
    return function(input) {
        if (input!=undefined){
            return input
            .replace(/\r\n/g,'<br>')
            .replace(/\t/g,'&nbsp&nbsp&nbsp&nbsp')
            .replace('[PUB]',' ')
            .replace('[NOPUB]',' ');
        }
        else{
            return '';
        }
    };
});

/* Fonction pour la traduction des filtres */
app.filter('traduction', function($rootScope) {
    return function(input, key){
        // Si le input est DESC ou ASC (pour la date ou la pertinence)
        if (input == "DESC" || input == "ASC"){
            input = key + '_' + input;
        }
        // Si le input vaut 0, on le remplace par 1 afin de ne pas avoir une page 0 (pour la pagination)
        if (input == "0"){
            input = "1";
        }
        if (typeof input=='undefined' || typeof $rootScope.config.trad=='undefined' || typeof $rootScope.config.trad[input]=='undefined'){
            return input;
        }
        else{
            return $rootScope.config.trad[input];
        }
    };
});

/* Fonction pour dédoubler les themes */
app.filter('dedoublonne', function() {
    return function(input){
        if (input==undefined){
            return [];
        }
        var newList = [];
        var tt = [];
        for (var i = 0; i < input.length; i++) {
            if (newList[input[i]] == undefined) {
                newList[input[i]] = input[i];
                tt.push(input[i]);
            }
        }
        return tt;
    };
});