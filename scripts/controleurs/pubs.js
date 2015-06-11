app.controller('PubCtrl', function ($scope, $log, PubFactory) {
    $scope.pubs = false;                // On initialise les pubs à false pour les remplir après
    $scope.pubFactory = PubFactory;     // On donne à pubFactory la valeur de PubFactory (pour contenir tous les attributs et méthodes)
    $scope.$log = $log;                 // Pour le debug
    
    // Fonction qui affecte data (toutes les pubs) à $scope.pubs
    PubFactory.getPubs().then(function(data){
        $scope.pubs = data;
        $scope.pub = PubFactory.getRandomPub($scope.pubs);
    });
})