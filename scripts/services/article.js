app.factory('ArticleFactory', function ($http, $rootScope, $q) {

    var factory = {
        URL : '',
        articles : false,               // Variable où l'on stocke tous les articles, initialisée à false
        filterOld : '',                 // Variable où l'on stocke l'ancien filtre, initialisée à vide
        article : [],                   // Variable où l'on stocke un article, initialisée à un tableau vide
        themes : false,                 // Variable où l'on stocke tous les thèmes, initialisée à false
        entity_types : false,           // Variable où l'on stocke tous les entity_types, initialisée à false
        rubriques : false,              // Variable où l'on stocke toutes les rubriques, initialisée à false
        typesRealisation : false,       // Variable où l'on stocke tous les types de réalisation, initialisée à false
        typesTravaux : false,           // Variable où l'on stocke tous les types de travaux, initialisée à false
        fabricants : false,             // Variable où l'on stocke tous les fabricants, initialisée à false
        categories : false,             // Variable où l'on stocke tous les categories, initialisée à false
        nbArtMax : 36,                  // Nombre d'articles par page
        nbPub : 8,                      // Nombre de pubs par page

        // Entity à afficher sur la page d'accueil
        entity_default : 'article_edito OR produitheque_produit OR reseau_realisation',

        /* Fonction qui choisit aléatoirement l'emplacement de la pub
         *  Paramètre : $index, un entier 
         *  Traitement : - resDivision prend la valeur entière du quotient de nbArtMax par nbPub
         *               - resModulo prend la valeur du modulo de $index et resDivision
         *  Résultat : true ou false, true si resModulo vaut 0
         */
        emplacementPub : function ($index){
            if ($index > 0){
                var resDivision = factory.nbArtMax/factory.nbPub;
                var resModulo = $index%Math.floor(resDivision); 
                return (resModulo) == 0;
            }
            else
                return false;
        },

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
                var URL = 'http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?nb_item='+factory.nbArtMax;
                //var URL2 = 'http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?ENTITY=article_edito OR produitheque_produit&themeFILTER=(sm_theme:EDF OR sm_theme:Architecte) OR (sm_rubrique:Insolite OR sm_rubrique:Immobilier)';

                /* On regarde si un paramètre est passé dans les filtres, si oui, on ajoute ce dernier à l'URL du WS
                 *  keyword : Mot clé, on filtre automatiquement par score décroissant (Du plus pertinent au moins pertinent)
                 *  sort_order_date_or_relevance : Date de publication si true, pertinence si false
                 *  theme : Thème, uniquement pour les article_edito
                 *  entity_type : Type d'entité
                 *  rubrique : Rubriques, uniquement pour les article_edito
                 *  type_realisation : Types de réalisation, uniquement pour les reseau_realisation
                 *  type_travaux : Types de travaux, uniquement pour les reseau_realisation
                 *  fabricant : Fabricant, uniquement pour les produitheque_produit
                 *  page : Page de résultat des articles
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
                    if (typeof filter.theme !== 'undefined')
                        URL = URL +'&themeFILTER='+encodeURIComponent(filter.theme);
                    if (typeof filter.entity_type !== 'undefined')
                        URL = URL +'&ENTITY='+filter.entity_type;
                    else
                        URL = URL +'&ENTITY='+factory.entity_default;
                    if (typeof filter.rubrique !== 'undefined')
                        URL = URL +'&rubriqueFILTER='+filter.rubrique;
                    if (typeof filter.type_realisation !== 'undefined')
                        URL = URL +'&type_realFILTER='+filter.type_realisation;
                    if (typeof filter.type_travaux !== 'undefined')
                        URL = URL +'&type_travFILTER='+filter.type_travaux;
                    if (typeof filter.fabricant !== 'undefined')
                        URL = URL +'&fabricantFILTER='+filter.fabricant;
                    if (typeof filter.page !== 'undefined')
                        URL = URL +'&N='+filter.page;
                    if (typeof filter.manual !== 'undefined')
                        URL = URL +'&manualFILTER='+filter.manual;
                }
                else{
                    URL = URL +'&ENTITY='+factory.entity_default;
                }
                factory.URL = URL;
                /* On récupère les articles */
                $http.get(URL)
                // En cas de succès les articles prennent la valeur de la recherche get (data.items)
                .success(function(data, status){
                    factory.articles = data;
                    
                    /* On récupère toutes les facets : theme, entity_type, rubrique, type_real, type_trav, fabricant, recruteur */
                    if (typeof data!== 'undefined' && typeof data.facets !== 'undefined'){
                        // Entity types
                        if (typeof data.facets.entity_type!== 'undefined'){
                            factory.entity_types = [];
                            angular.forEach(data.facets.entity_type, function(value){
                                factory.entity_types.push(value);
                            })
                        }
                        // Thèmes
                        if (typeof data.facets.theme!== 'undefined')
                            factory.themes = data.facets.theme;
                        // Rubriques
                        if (typeof data.facets.rubrique!== 'undefined')
                            factory.rubriques = data.facets.rubrique;
                        // Types de Réalisation
                        if (typeof data.facets.type_realisation!== 'undefined')
                            factory.typesRealisation = data.facets.type_realisation;
                        // Types de Travaux
                        if (typeof data.facets.type_travaux!== 'undefined')
                            factory.typesTravaux = data.facets.type_travaux;
                        // fabricants
                        if (typeof data.facets.fabricant!== 'undefined')
                            factory.fabricants = data.facets.fabricant;
                        // fabricants
                        if (typeof data.facets.categorie!== 'undefined')
                            factory.categorie = data.facets.categorie;
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

        /* Fonction retournant tous les entity_type 
         *  Paramètre : Aucun
         *  Résultat : factory.entity_types, la liste des entity_types
         */ 
        getEntityTypes : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.entity_types);
            }, 1000);
            return deferred.promise;
        },

        /* Fonction retournant tous les thèmes 
         *  Paramètre : Aucun
         *  Résultat : factory.themes, la liste des thèmes
         */ 
        getThemes : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.themes);
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
                deferred.resolve(factory.rubriques);
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
        },

        /* Fonction retournant tous les fabricants
         *  Paramètre : Aucun
         *  Résultat : factory.fabricants, la liste des fabricants
         */ 
        getFabricants : function(){
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve(factory.fabricants);
            }, 1000);
            return deferred.promise;
        },

        /* Fonction retournant tous les categories
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