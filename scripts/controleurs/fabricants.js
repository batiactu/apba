app.controller('FabricantsCtrl', function ($scope, FabricantFactory) {
    $scope.fabricants = false;          // On initialise les fabricants à false pour les remplir après
    $scope.newTab = [];
    $scope.listeFabricants = false;
    
    // Affecte data à fabricants (tous les fabricants), data mais triés par ordre Alphabétique à listeFabricants
    FabricantFactory.getFabricants().then(function(data){
        $scope.fabricants = data;
        $scope.listeFabricants = $scope.triFabricants(data);
        $scope.triSelonLettre($scope.filter.fabricant);

    });

    //Fonction qui retourne tous les articles par fabricant (passé en paramètre)
    $scope.sortByFabricants = function(fabricant){
        $scope.filter.entity_type = 'produitheque_produit';
        $scope.filter.fabricant = fabricant;
    }

    /* Fonction permettant de trier des éléments par ordre alphabetique 
     *  Paramètres : a, b : des éléments à comparer, de type string
     *  Résultat : - -1, Si la chaine a est avant b (alphabetiquement parlant)
     *             - 0, Si la chaine a est comme b (alphabetiquement parlant)
     *             - 1, Si la chaine a est après b (alphabetiquement parlant)
     */
    $scope.triAlphabetique = function(a, b){
        if (a.name < b.name)
            return -1;
        else if (a.name == b.name)
            return 0;
        else
            return 1;
    }
    
    /* Fonction permettant de trier des éléments par ordre alphabetique 
     *  Paramètre : tabSource, un tableau contenant des string à comparer
        Traitement : On applique la fonction triAlphabetique à tabSource pour le ranger par ordre alphabétique
     *  Résultat : tabSourceAlpha, le tableau trié par ordre alphabétique
     */
    $scope.triFabricants = function(tabSource){
        if (tabSource== undefined || tabSource== false)
            return '';
        else{
            var tabSourceAlpha = tabSource.sort($scope.triAlphabetique);
            $scope.triSelonLettre(tabSourceAlpha);
            return tabSourceAlpha;
        }
    }

    /* Fonction permettant de récupérer la première lettre de chaque fabricant
     *  Paramètre : tab, un tableau de fabricants, triés par ordre alphabétique au préalable
     *  Traitement : - On récupère la première lettre de chaque fabricant
     *               - On transforme cette lettre en son code ASCII
     *               - On ôte 65 à ce code ASCII (car code ASCII 'A' = 65, ainsi A vaut 0 suit à l'opération)
     *               - On ajout à newTab[firstLetter] tous les fabricants commençant par la lettre désignée par firstLetter
     *  Résultat : newTab, un tableau de sous-tableaux, chaque sous-tableau regroupe les fabricants commençant par la même lettre
     */
    $scope.triSelonLettre = function(tab){
        if(tab==null || tab == undefined || tab =='' || tab == [])
            return '';
        else{
            var newTab = [];
            for(i=0 ; i<tab.length ; i++){
                if (tab[i].name=='')
                    return '';
                else{
                    var firstLetter = tab[i].name.substr(0,1); // une lettre
                    firstLetter = firstLetter.charCodeAt(0)-65;

                    if (newTab[firstLetter]==undefined){
                        newTab[firstLetter] = [];
                    }
                    tab[i] = {name:tab[i].name, value:tab[i].value};
                    newTab[firstLetter].push(tab[i]);
               }
            }
            $scope.newTab = newTab;
        }
    }

})