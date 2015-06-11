app.factory('RealisationFactory', function ($http, $rootScope, $q) {

    var factory = {
        URL : '',
        articles : false,               // Variable où l'on stocke tous les articles, initialisée à false
        article : [],                   // Variable où l'on stocke un article, initialisée à un tableau vide
        entity_types : false,           // Variable où l'on stocke tous les entity_types, initialisée à false
        typesRealisation : false,       // Variable où l'on stocke tous les types de réalisation, initialisée à false
        typesTravaux : false,           // Variable où l'on stocke tous les types de travaux, initialisée à false

        /* Fonction qui retourne tous les articles
         *  Paramètre : filter, un objet permettant de filtrer les articles selon différents critères (date/pertinence, keyword, page, thème, rubrique, type réalisation)
         *  Traitement : - On vide la liste des articles si un filtre avait été passé
         *               - On complète l'URL du WebService en fonction du filtre passé
         *               - Pour les facets (thème, entity_type, rubrique, type_realisation) on leur affecte leur valeur respective (data.facets.[NomFacet]) 
         *  Résultat : factory.articles, la liste des articles, éventuellement filtrés si un fitlre a été passé
         */
        getArticles : function(filter){
            $rootScope.config.loader = true;
            var deferred = $q.defer();
            // Si on a passé un filtre (n'importe lequel), alors on vide la liste des articles
            if (typeof filter!== 'undefined' && (angular.toJson(filter)!=factory.filterOld)){
                    factory.filterOld = angular.toJson(filter);
                    factory.articles = false;
            }
            // Si les articles existent alors on les affiche
            if (factory.articles !== false){
                deferred.resolve(factory.articles);
                $rootScope.config.loader = false;
            }
            // Sinon on les récupère
            else{
                // Variable à compléter afin d'y passer des paramètres (filtres)
                var URL = 'http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?nb_item=36&ENTITY=reseau_realisation';
                console.log(URL)

                /* On regarde si un paramètre est passé dans les filtres, si oui, on ajoute ce dernier à l'URL du WS
                 *  type_realisation : Types de réalisation, uniquement pour les reseau_realisation
                 *  type_travaux : Types de travaux, uniquement pour les reseau_realisation
                 *  page : Page de résultat des articles
                 */
                if (typeof filter!== 'undefined'){                        
                    if (typeof filter.type_realisation !== 'undefined')
                        URL = URL +'&type_realFILTER='+filter.type_realisation;
                    if (typeof filter.type_travaux !== 'undefined')
                        URL = URL +'&type_travFILTER='+filter.type_travaux;
                    if (typeof filter.page !== 'undefined')
                        URL = URL +'&N='+filter.page;
                    if (typeof filter.manual !== 'undefined')
                        URL = URL +'&manualFILTER='+filter.manual;
                }
                /* On récupère les articles */
                $http.get(URL)
                // En cas de succès les articles prennent la valeur de la recherche get (data.items)
                .success(function(data, status){
                    console.log(URL)
                    factory.articles = data;
                    
                    /* On récupère toutes les facets : theme, entity_type, rubrique, type_real, type_trav, fabricant, recruteur */
                    if (typeof data!== 'undefined' && typeof data.facets !== 'undefined'){
                        // Types de Réalisation
                        if (typeof data.facets.type_realisation!== 'undefined')
                            factory.typesRealisation = data.facets.type_realisation;
                        // Types de Travaux
                        if (typeof data.facets.type_travaux!== 'undefined')
                            factory.typesTravaux = data.facets.type_travaux;
                    }

                    if (factory.articles == ''){
                        factory.articles = 'Désolé, votre recherche n\'a pas abouti.';
                    }
                    // On affiche les articles
                    deferred.resolve(factory.articles);
                    $rootScope.config.loader = false;
                })
                // En cas d'échec on affiche un message d'erreur
                .error(function(data, status){
                    deferred.reject('Impossible de récupérer les articles');
                });
            }
            return deferred.promise;
        },

        /* Fonction retournant un article dont l'id est passé en paramètre
         *  Paramètre : id, l'id d'un article
         *  Traitement : On complète l'URL du WebService avec l'id de l'article
         *  Résultat : factory.article[id], un objet article
         */ 
        getArticle : function(id){
            var article = {};
            var deferred = $q.defer();
            if (factory.article[id] !== undefined){
                deferred.resolve(factory.article[id]);}
                else{
                    $http.get('http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?ID='+id)
                    .success(function(data, status){
                        factory.article[id] = data.items;
                        deferred.resolve(factory.article[id]);
                    })
                    .error(function(data, status){
                        deferred.reject('Impossible de récupérer l\'article');
                    });
                }
                return deferred.promise;
        },

        /* Fonction retournant tous les types de réalisation 
         *  Paramètre : Aucun
         *  Résultat : factory.typesRealisation, la liste des types de réalisation
         */ 
        getTypesRealisation : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.typesRealisation);
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
                deferred.resolve(factory.typesTravaux);
            }, 1000);
            return deferred.promise;
        }
    };
    return factory;
});