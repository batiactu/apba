app.factory('PubFactory', function ($http, $q) {

    var factoryPub = {
        pubs : false, // Variable où l'on stocke toutes les pubs, initialisée à false
        URLPub : 'http://capinfoproreport.batiactu.com/cap_pub/scripts/get-pub-support-emplacement.php?e=DROITE1&JSON', // URL du fichier JSON retournant toutes les pubs

        /* Fonction qui retourne toutes les pubs
         *  Paramètre : Aucun
         *  Traitement : Si les pubs comportent la chaîne de caractère "swf" (pour les animations flash) on les exclue
         *  Résultat : pubs, un tableau contenant des objets pub
         */
        getPubs : function(){
            var deferred = $q.defer();

            // Si les pubs existent alors on les affiche
            if (factoryPub.pubs !== false){
                deferred.resolve(factoryPub.pubs);
            }
            // Sinon on les récupère
            else{
                /* On récupère les pubs */
                $http.get(factoryPub.URLPub)
                // En cas de succès les pubs prennent la valeur de la recherche get (data.items), et on affiche les pubs
                .success(function(data, status){
                    angular.forEach(data, function(value, key){
                        // On ne renvoie ques les gif (plus précisément on exclue les swf)
                        if (value.fichier.indexOf("swf")==-1 && value.fichier !=''){
                            if (factoryPub.pubs == false){
                                factoryPub.pubs = [];
                            }
                        factoryPub.pubs.push(value);
                        }
                    })
                    deferred.resolve(factoryPub.pubs);
                })
                // En cas d'échec on affiche un message d'erreur
                .error(function(data, status){
                    deferred.reject('Impossible de récupérer les pubs');
                });
            }
            return deferred.promise;
        },

        /* Fonction renvoyant une pub au hasard
         *  Paramètre : listePubs, la liste de toutes les pubs (par la fonction getPubs)
         *  Traitement : On récupère la longueur de listePubs pour faire un random dessus et ainsi avoir un entier (qui sera la position de la pub à retourner)
         *  Résultat : listePub[unePub], Une pub faisant partie de listePubs mais avec une position aléatoire de cette liste (unePub)
         */
        getRandomPub : function(listePubs){
            var unePub = Math.floor(Math.random() * listePubs.length) +1;
            return listePubs[unePub];
        }
    };
    return factoryPub;
});