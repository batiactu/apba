app.controller('RealPrefCtrl',  function ($scope, $location){
    var realisations_preferees = JSON.parse(localStorage.getItem("realisations_preferees"));

    if(realisations_preferees == null){
        realisations_preferees = {};
    }
    $scope.realisations_preferees = realisations_preferees;
    console.log($scope.realisations_preferees)      
});