app.factory('GroupeFactory', function ($http, $rootScope, $q) {

    var factory = {
        groupes : false,               // Variable où l'on stocke tous les groupes, initialisée à false
        categories : false,            // Variable où l'on stocke tous les thèmes, initialisée à false

        /* Fonction qui retourne tous les groupes
         *  Paramètre : filter, un objet permettant de filtrer les groupes selon différents critères (date/pertinence, keyword, page, thème, rubrique, type réalisation)
         *  Traitement : - On vide la liste des groupes si un filtre avait été passé
         *               - On complète l'URL du WebService en fonction du filtre passé
         *               - Pour les facets (thème, entity_type, rubrique, type_realisation) on leur affecte leur valeur respective (data.facets.[NomFacet]) 
         *  Résultat : factory.groupes, la liste des groupes, éventuellement filtrés si un fitlre a été passé
         */
        getGroupes : function(filter){
            $rootScope.config.loader = true;
            var deferred = $q.defer();
            // Si on a passé un filtre (n'importe lequel), alors on vide la liste des groupes
            if (typeof filter!== 'undefined' && (angular.toJson(filter)!=factory.filterOld)){
                    factory.filterOld = angular.toJson(filter);
                    factory.groupes = false;
            }
            // Si les groupes existent alors on les affiche
            if (factory.groupes !== false){
                deferred.resolve(factory.groupes);
                $rootScope.config.loader = false;
            }
            // Sinon on les récupère
            else{
                // Variable à compléter afin d'y passer des paramètres (filtres)
                var URL = 'http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?ENTITY=reseau_groupe';

                /* On regarde si un paramètre est passé dans les filtres, si oui, on ajoute ce dernier à l'URL du WS
                 *  keyword : Mot clé, on filtre automatiquement par score décroissant (Du plus pertinent au moins pertinent)
                 *  sort_order_date_or_relevance : Date de publication si true, pertinence si false
                 *  theme : Thème, uniquement pour les article_edito
                 *  entity_type : Type d'entité
                 *  rubrique : Rubriques, uniquement pour les article_edito
                 *  type_realisation : Types de réalisation, uniquement pour les reseau_realisation
                 *  type_travaux : Types de travaux, uniquement pour les reseau_realisation
                 *  fabricant : Fabricant, uniquement pour les produitheque_produit
                 *  page : Page de résultat des groupes
                 */
                if (typeof filter!== 'undefined'){                        
                    var date_score = '';
                    if (filter.sort_order_date_or_relevance == true){
                        date_score = 'date';
                    }
                    else{
                        date_score = 'score';
                    }
                    if (typeof filter.keywords !== 'undefined'){
                        URL = URL +'&KEYWORDS='+filter.keywords;
                    }
                    else{
                        date_score='date';
                    }
                    URL = URL +'&SORT_ORDER='+date_score+'|DESC';
                    if (typeof filter.categorie !== 'undefined')
                        URL = URL +'&categorieFILTER='+encodeURIComponent(filter.categorie);
                    if (typeof filter.page !== 'undefined')
                        URL = URL +'&N='+filter.page;
                }
                /* On récupère les groupes */
                $http.get(URL)
                // En cas de succès les groupes prennent la valeur de la recherche get (data.items)
                .success(function(data, status){
                    factory.groupes = data;
                    
                    /* On récupère toutes les facets : theme, entity_type, rubrique, type_real, type_trav, fabricant, recruteur */
                    if (typeof data!== 'undefined' && typeof data.facets !== 'undefined'){
                        // fabricants
                        if (typeof data.facets.categorie!== 'undefined')
                            factory.categories = data.facets.categorie;
                    }
                    if (factory.groupes == ''){
                        factory.groupes = 'Désolé, votre recherche n\'a pas abouti.';
                    }
                    // On affiche les groupes
                    deferred.resolve(factory.groupes);
                    $rootScope.config.loader = false;
                })
                // En cas d'échec on affiche un message d'erreur
                .error(function(data, status){
                    deferred.reject('Impossible de récupérer les groupes');
                });
            }
            return deferred.promise;
        },

        /* Fonction retournant tous les entity_type 
         *  Paramètre : Aucun
         *  Résultat : factory.categories, la liste des categories
         */ 
        getCategories : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.categories);
            }, 1000);
            return deferred.promise;
        }
    };
    return factory;
});