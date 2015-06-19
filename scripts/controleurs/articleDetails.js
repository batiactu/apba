app.controller('ArticleDetailsCtrl',  function ($scope, ArticleFactory, $log, $routeParams, $route, $filter, $location){
    $scope.article = false;                                             // On initialise un article à false pour le remplir après
    $scope.rubriques = false;                                           // On initialise les rubriques à false pour les remplir après
    $scope.fabricants = false;                                          // On initialise les fabricants à false pour les remplir après
    $scope.typesRealisation = false;                                    // On initialise les types de réalisation à false pour les remplir après
    $scope.page = ($routeParams.page==undefined)?1:$routeParams.page;   // Pour rediriger vers la bonne page selon la route
    $scope.$routeParams = $routeParams;                                 // Pour connaître les routes
    $scope.$location = $location;                                       // Pour connaître la localisation de la page
    $scope.$log = $log;                                                 // Pour le debug
    $scope.unArticle = {};                                              // On initialise unArticle à vide pour récupérer le contenu du zs_json

    $scope.realisations_preferees = JSON.parse(localStorage.getItem("realisations_preferees"));
    $('#favoriInfoAdd').hide();
    $('#favoriInfoDelete').hide();
    /* Permet de récupérer l'article courant en fonction de son id */
    ArticleFactory.getArticle($routeParams.id).then(function(data){
        $scope.article = data[0];                                       // Variable contenant l'article en entier
        $scope.unArticle = $scope.fromJJson($scope.article.zs_json);    // Variable permettant d'appeler le zs_json
    });

    /* Fonction retournant le chemin d'un template (fichier HTML)
     *  Paramètre : entity, un entity_type
     *  Résultat : le chemin (absolu) du template correspondant à l'entity_type
     */
    $scope.changeTemplate = function (entity){
        return 'views/templates/' + entity + '.html'
    }

    /* Fonction permettant de retourner à la recherche avec le bon entity_type
     *  Paramètre : entity, l'entity_type de l'article en cours
     *  Traitement : Selon l'entity_type on renvoie vers la page Home avec l'entity passé en paramètre
     *  Résultat : Aucun
     */
    $scope.retourRecherche = function(entity){
        if (entity=='reseau_realisation'){
            $location.path('/realisations');
        }
        else if (entity=='article_edito'){
            $location.path('/actualites');
        }
        else if (entity=='produitheque_produit'){
            $location.path('/produits');
        }
        else if (entity=='reseau_groupe'){
            $location.path('/groupes');
        }
        else{
            $location.path('/');
        }
    };


    /* Fonction retournant une valeur au format JSON
     *  Paramètre : value, une valeur à convertir au format JSON
     *  Résultat : angular.fromJson(value), valeur de value au format JSON
     */
    $scope.fromJJson = function (value) {
        return angular.fromJson(value);
    }

    /* Fonction modifiant l'URL d'une image afin de la redimensionner
     *  Paramètre : urlIMG, une URL
     *  Résultat : urlModif, l'URL modifiée
     */
    $scope.imgResize = function (urlIMG) {
        var urlModif = urlIMG.replace('medium', 'medium_auto/300-200-c');
        return urlModif ;
    }

    /* Fonction modifiant l'URL d'une image afin de la redimensionner en grand
     *  Paramètre : urlIMG, une URL
     *  Résultat : urlModif, l'URL modifiée avec 
     */
    $scope.imgResizeToBig = function (urlIMG) {
        var urlModif = urlIMG.replace('medium', 'big');
        return urlModif ;
    }

    /* Fonction retournant une chaîne de caractère où le premier est une majuscule
     *  Paramètre : string, la chaîne de caractère où il faut mettre le premier caractère en majuscule
     *  Traitement : On met le 1er caractère en majuscule et on ajoute la suite de la chaîne
     *  Résultat : stringUpper, le premier caractère est une majuscule
     */
    $scope.upperCaseFirstChar = function (string) {
        stringUpper = string.charAt(0).toUpperCase() + string.slice(1);
        return stringUpper;
    }

    /* Fonction retournant la taille d'une liste de pages (si la liste de pages n'est pas null)
     *  Paramètre : listePage, une liste de page
     *  Résultat : listePage.length +1, la longueur de listePage
     */
    $scope.comptePage = function (listePage){
        if (listePage == null || listePage == undefined){
            return '';
        }
        else {
            return listePage.length +1;    
        }  
    }

    /* Fonction retournant une valeur de type entier
     *  Paramètre : value, un élément qui n'est pas un entier
     *  Résultat : parseInt(value), value de type entier
     */
    $scope.int_val = function(value){
        return parseInt(value);
    }

    /* Fonction retournant le nom d'une photo et sa taille (nécessaire pour connaître l'adresse URL de la photo)
     *  Paramètre : - listePhotos, la liste des photos de l'article
     *              - numPage, le numéro de la page courante
     *  Résultat : un objet contenant le nom (fichier) et la taille (taille) de chaque photo 
     */
    $scope.lienPhoto = function(listePhotos, numPage){
        var i;
        for (i=0; i<listePhotos.length;i++){
            if (parseInt(listePhotos[i].page) == numPage){
                var fichier = listePhotos[i].photo.fichier1;
                var taille = listePhotos[i].taille;
                return {"fichier": listePhotos[i].photo.fichier1, "taille": taille};
            }
        }
        return {};
    }

    /* Fonction retournant le nom d'une photo et sa taille (nécessaire pour connaître l'adresse URL de la photo)
     *  Paramètre : Aucun
     *  Traitement : - Si c'est le tout premier article alors on affecte des valeurs que pour l'article suivant
                     - Si c'est un article qui n'est ni le premier ni le dernier alors on affecte des valeurs à l'article précédent et suivant
                     - Si c'est le tout dernier article alors on affecte des valeurs que pour l'article précédent
     *  Résultat : un objet contenant les ids, labels et images des articles précédents et suivants (s'ils existent) 
     */
    $scope.precSuiv = function(){
        var i;
        var index=-1;
        var idPrec = '';
        var labelPrec = '';
        var imgPrec = '';
        var idSuiv = '';
        var labelSuiv = '';
        var imgSuiv = '';

        // Si articles ne vaut pas false alors on fait le traitement.
        if(ArticleFactory.articles){
            if (ArticleFactory.articles.items == undefined) {
                return {};
            }
            for (i=0; i<ArticleFactory.articles.items.length; i++){
                if ((ArticleFactory.articles.items[i].id)==($routeParams.id)){
                    index=i;
                }  
            }
            // Il n'y a pas de précédent car on est au tout premier article
            if (index==0){
                if (ArticleFactory.articles.items!=undefined && ArticleFactory.articles.items[index+1]!=undefined){
                    var idSuiv = ArticleFactory.articles.items[index+1].id;
                    var labelSuiv = ArticleFactory.articles.items[index+1].label;
                    if (ArticleFactory.articles.items[index+1].sm_image_url != undefined && ArticleFactory.articles.items[index+1].sm_image_url[0] != undefined)
                        var imgSuiv = ArticleFactory.articles.items[index+1].sm_image_url[0];
                    else
                        var imgSuiv = null;
                }
            }
            // Il n'y a pas de suivant car on est au dernier article
            else if(index==ArticleFactory.articles.items.length-1){
                if (ArticleFactory.articles.items!=undefined && ArticleFactory.articles.items[index-1]!=undefined){
                    var idPrec = ArticleFactory.articles.items[index-1].id;
                    var labelPrec = ArticleFactory.articles.items[index-1].label;
                    if (ArticleFactory.articles.items[index-1].sm_image_url != undefined && ArticleFactory.articles.items[index-1].sm_image_url[0] != undefined)
                        var imgPrec = ArticleFactory.articles.items[index-1].sm_image_url[0];
                    else
                        var imgPrec = null;
                }
            }
            // Il y a un précédent et un suivant car on est en plein milieu
            else{
                if (ArticleFactory.articles.items!=undefined && ArticleFactory.articles.items[index-1]!=undefined){
                    var idPrec = ArticleFactory.articles.items[index-1].id;
                    var labelPrec = ArticleFactory.articles.items[index-1].label;
                    if (ArticleFactory.articles.items[index-1].sm_image_url != undefined && ArticleFactory.articles.items[index-1].sm_image_url[0] != undefined)
                        var imgPrec = ArticleFactory.articles.items[index-1].sm_image_url[0];
                    else
                        var imgPrec = null;
                }
                if (ArticleFactory.articles.items!=undefined && ArticleFactory.articles.items[index+1]!=undefined){
                    var idSuiv = ArticleFactory.articles.items[index+1].id;
                    var labelSuiv = ArticleFactory.articles.items[index+1].label;
                    if (ArticleFactory.articles.items[index+1].sm_image_url != undefined && ArticleFactory.articles.items[index+1].sm_image_url[0] != undefined)
                        var imgSuiv = ArticleFactory.articles.items[index+1].sm_image_url[0];
                    else
                        var imgSuiv = null;
                }
            }
            return {"idPrec":idPrec,"labelPrec":labelPrec,"imgPrec":imgPrec,"idSuiv":idSuiv,"labelSuiv":labelSuiv,"imgSuiv":imgSuiv}
        }
        else{
            return {};
        }  
    return {};

    }

    /* Fonction permettant de passer à la page précédente au swipe lorsque l'on se trouve sur un article à plusieurs
     *  Paramètres : page, la page courante, unArticle, l'article courant
     */
    $scope.pagePrecedente = function(page, unArticle){
        if ($scope.int_val($scope.page)>1){
            $location.path('/articles/'+($routeParams.id)+'/'+($scope.int_val($scope.page)-1));
        }   
    };

    /* Fonction permettant de passer à la page suivante au swipe lorsque l'on se trouve sur un article à plusieurs
     *  Paramètres : page, la page courante, unArticle, l'article courant
     */
    $scope.pageSuivante = function(page, unArticle){
        if ($scope.int_val($scope.page) < $scope.comptePage(unArticle.TPage)){
            $location.path('/articles/'+($routeParams.id)+'/'+($scope.int_val($scope.page)+1));
        }
    };

    /* Fonction permettant de renvoyer un tableau vide
     * Paramètre : n, un entier
     * Résultat : Array(n), un tableau de dimension n.
     */
    $scope.repeteFakeArticles = function(n){
        return new Array(n);
    }

    /* Fonction permettant d'ajouter un thème aux thèmes favoris et changeant la couleur de ce thème
     *  Paramètres : theme, le thème à ajouter. index, la position de ce thème dans la liste des thèmes.
     *  Traitement : - On change la couleur du thème (de noir à vert ou de vert à noir)
     *               - On ajoute le thème à l'objet des préférences utilisateur s'il n'y est pas déjà. Sinon on le supprime
     *  Résultat : Aucun
     */
    $scope.ajoutRealisationPreferee = function(article){
        // On ajoute l'article à l'objet
        if($scope.realisations_preferees == null){
            $scope.realisations_preferees = {};
        }
        if (typeof $scope.realisations_preferees[article.entity_id] == 'undefined'){
            $scope.realisations_preferees[article.entity_id] = article;
            $('#ajout-real-favoris').text("Retirer cette réalisation des favoris");
            $('#favoriInfoAdd').fadeIn();
            setTimeout(function() {
                $('#favoriInfoAdd').fadeOut();
            }, 1500);
        }
        else{
            delete($scope.realisations_preferees[article.entity_id]);
            $('#ajout-real-favoris').text("Ajouter cette réalisation aux favoris");
            $('#favoriInfoDelete').fadeIn();
            setTimeout(function() {
                $('#favoriInfoDelete').fadeOut();
            }, 1500);
        }
        localStorage.setItem("realisations_preferees",JSON.stringify($scope.realisations_preferees));
    }

    /* Pour afficher l'image en grand (Réalisations) */
    $("#toBigImg").fancybox();

    /*Pour faire un diaporama (Actualités)*/
    $(document).ready(function() {
        $(".fancybox-button").fancybox({
            prevEffect      : 'none',
            nextEffect      : 'none',
            closeBtn        : false,
            helpers     : {
                title   : { type : 'inside' },
                buttons : {}
            }
        });
    });

        
});