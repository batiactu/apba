app.factory('CompteFactory', function ($http, $rootScope, $q) {

    var factory = {
        facets : false,                 // Variable où l'on stocke tous les facets, initialisée à false
        themes : false,                 // Variable où l'on stocke tous les thèmes, initialisée à false
        rubriques : false,              // Variable où l'on stocke toutes les rubriques, initialisée à false
        typesRealisation : false,       // Variable où l'on stocke tous les types de réalisation, initialisée à false
        typesTravaux : false,           // Variable où l'on stocke tous les types de travaux, initialisée à false
        fabricants : false,             // Variable où l'on stocke tous les fabricants, initialisée à false

        /* Fonction qui retourne tous les facets
         *  Paramètre : filter, un objet permettant de filtrer les facets selon différents critères (date/pertinence, keyword, page, thème, rubrique, type réalisation)
         *  Traitement : - On vide la liste des facets si un filtre avait été passé
         *               - On complète l'URL du WebService en fonction du filtre passé
         *               - Pour les facets (thème, entity_type, rubrique, type_realisation) on leur affecte leur valeur respective (data.facets.[NomFacet]) 
         *  Résultat : factory.facets, la liste des facets, éventuellement filtrés si un fitlre a été passé
         */
        getAllFacets : function(filter){
            $rootScope.config.loader = true;
            var deferred = $q.defer();
            // Si les facets existent alors on les affiche
            if (factory.facets !== false){
                deferred.resolve(factory.facets);
                $rootScope.config.loader = false;
            }
            // Sinon on les récupère
            else{
                // Variable à compléter afin d'y passer des paramètres (filtres)
                var URL = 'http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php';

                /* On récupère les articles */
                $http.get(URL)
                // En cas de succès les articles prennent la valeur de la recherche get (data.items)
                .success(function(data, status){
                    factory.facets = data.facets;
                    if (factory.facets == ''){
                        factory.facets = 'Désolé, votre recherche n\'a pas abouti.';
                    }
                    // On affiche les facets
                    deferred.resolve(factory.facets);
                    $rootScope.config.loader = false;
                })
                // En cas d'échec on affiche un message d'erreur
                .error(function(data, status){
                    deferred.reject('Impossible de récupérer les facets');
                });
            }
            return deferred.promise;
        },

        /* Fonction retournant tous les thèmes 
         *  Paramètre : Aucun
         *  Résultat : factory.themes, la liste des thèmes
         */ 
        getThemes : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.facets.theme);
            }, 1000);
            return deferred.promise;
        },

        /* Fonction retournant toutes les rubriques 
         *  Paramètre : Aucun
         *  Résultat : factory.rubriques, la liste des rubriques
         */ 
        getRubriques : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.facets.rubrique);
            }, 1000);
            return deferred.promise;
        },

        /* Fonction retournant tous les types de réalisation 
         *  Paramètre : Aucun
         *  Résultat : factory.typesRealisation, la liste des types de réalisation
         */ 
        getTypesRealisation : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.facets.types_realisation);
            }, 1000);
            return deferred.promise;
        },

        /* Fonction retournant tous les types de travaux 
         *  Paramètre : Aucun
         *  Résultat : factory.typesTravaux, la liste des types de travaux
         */ 
        getTypesTravaux : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.facets.types_travaux);
            }, 1000);
            return deferred.promise;
        },

        /* Fonction retournant tous les fabricants
         *  Paramètre : Aucun
         *  Résultat : factory.fabricants, la liste des fabricants
         */ 
        getFabricants : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.facets.fabricant);
            }, 1000);
            return deferred.promise;
        }
    };
    return factory;
});