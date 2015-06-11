app.factory('ConfigFactory', function ($http, $q) {

    var factoryConf = {
        res : {},
        URLConfTrad : "scripts/config/trad.json",

        /* Fonction qui retourne les traductions de chaque élément
         *  Paramètre : Aucun
         *  Résultat : this.res, l'objet contenant les traductions
         */
        getTrad : function(){
            var deferred = $q.defer();
            $http.get(this.URLConfTrad)
            // En cas de succès this.res prend la valeur de la recherche get (data)
            .success(function(data, status){
                this.res = data;
                deferred.resolve(this.res);
            })
            // En cas d'échec 
            .error(function(data, status){
                deferred.reject('Impossible de récupérer la traduction');
            });
            return deferred.promise;
        }
    };
    return factoryConf;
});