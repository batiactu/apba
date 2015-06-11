app.factory('FabricantFactory', function ($http, $rootScope, $q) {

    var factory = {
            fabricants : false,     // Variable où l'on stocke tous les fabricants, initialisée à false
       
        /* Fonction qui retourne tous les fabricants
         *  Paramètre : Aucun
         *  Traitement : - Si les fabricants existent déjà on les affiche
         *               - Sinon : - On change l'entity_type pour forcer un CSS
         *                         - On récupère les fabricants et on les stocks dans factory.fabricants          
         *  Résultat : factory.fabricants, la liste des fabricants
         */
        getFabricants : function(){
            $rootScope.config.loader = true;
            var deferred = $q.defer();

            // Si les fabricants existent alors on les affiche
            if (factory.fabricants !== false){
                deferred.resolve(factory.fabricants);
                $rootScope.config.loader = false;
            }
            // Sinon on les récupère
            else{
                // URL pour forcer l'entity produitheque_produit
                var URL = 'http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?nb_item=1&ENTITY=produitheque_produit';

                /* On récupère les fabricants */
                $http.get(URL)
                // En cas de succès les fabricants prennent la valeur de la recherche get (data.facets.fabricant)
                .success(function(data, status){                    
                    /* On récupère toutes la facet fabricant */
                    if (typeof data!== 'undefined' && typeof data.facets !== 'undefined' && typeof data.facets.fabricant!== 'undefined'){
                        factory.fabricants = data.facets.fabricant;
                    }
                    // On affiche les fabricants
                    deferred.resolve(factory.fabricants);
                    $rootScope.config.loader = false;
                })
                // En cas d'échec on affiche un message d'erreur
                .error(function(data, status){
                    deferred.reject('Impossible de récupérer les fabricants');
                });
            }
            return deferred.promise;
        }
    };
    return factory;
});