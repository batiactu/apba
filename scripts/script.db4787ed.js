var app=angular.module("myapp",["ngRoute","ngSanitize","toggle-switch","ui.bootstrap","ngTouch"]);app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"ArticlesCtrl"}).when("/articles/:id",{templateUrl:"views/article.html",controller:"ArticleDetailsCtrl"}).when("/articles/:id/:page",{templateUrl:"views/article.html",controller:"ArticleDetailsCtrl"}).when("/contact",{templateUrl:"views/contact.html"}).when("/connexion",{templateUrl:"views/connexion.html",controller:"IdentificationCtrl"}).when("/identification",{templateUrl:"views/identification.html",controller:"IdentificationCtrl"}).when("/inscription",{templateUrl:"views/inscription.html",controller:"IdentificationCtrl"}).when("/filactu",{templateUrl:"views/filactu.html",controller:"FilActuCtrl"}).when("/compte",{templateUrl:"views/compte.html",controller:"CompteCtrl"}).when("/gestionFilActu",{templateUrl:"views/gestionFilActu.html",controller:"CompteCtrl"}).when("/photos",{templateUrl:"views/photos.html",controller:"ArticlesCtrl"}).when("/discussions",{templateUrl:"views/discussions.html",controller:"ArticlesCtrl"}).when("/new_discussion",{templateUrl:"views/new_discussion.html",controller:"ArticlesCtrl"}).when("/gestion_realisations",{templateUrl:"views/realisations.html",controller:"ArticlesCtrl"}).when("/ajout_realisation",{templateUrl:"views/realisations/ajout_realisation.html",controller:"RealisationsCtrl"}).when("/mes_realisations",{templateUrl:"views/realisations/mes_realisations.html",controller:"RealisationsCtrl"}).when("/realisations_preferees",{templateUrl:"views/realisations/mes_realisations_preferees.html",controller:"RealPrefCtrl"}).when("/groupes",{templateUrl:"views/groupes.html",controller:"GroupesCtrl"}).when("/profil",{templateUrl:"views/profil.html",controller:"ArticlesCtrl"}).when("/actualites",{templateUrl:"views/home.html",controller:"ArticlesCtrl"}).when("/produits",{templateUrl:"views/home.html",controller:"ArticlesCtrl"}).when("/realisations",{templateUrl:"views/home.html",controller:"ArticlesCtrl"}).when("/enCoursDeveloppement",{templateUrl:"views/enCoursDeveloppement.html"}).when("/parametres_appli",{templateUrl:"views/parametres_appli.html"}).when("/conditions",{templateUrl:"views/conditions.html"}).when("/propos",{templateUrl:"views/propos.html"}).otherwise({redirectTo:"/"})}]),app.run(["$rootScope","$location","ConfigFactory",function(a,b,c){a.filter={sort_order_date_or_relevance:!1,switch_label:"Date"},a.config={},a.menuToggle={},a.config.loader=!1,a.pref_user={themes:{},rubriques:{},types_realisation:{},fabricants:{}},a.realisations_preferees={},c.getTrad().then(function(b){a.config.trad=b})}]),app.filter("range",function(){return function(a,b){b=parseInt(b);for(var c=1;b>=c;c++)a.push(c);return a}}),app.filter("replaceCharacter",function(){return function(a){return void 0!=a?a.replace(/\r\n/g,"<br>").replace(/\t/g,"&nbsp&nbsp&nbsp&nbsp").replace("[PUB]"," ").replace("[NOPUB]"," ").replace("&oelig;","œ"):""}}),app.filter("traduction",["$rootScope",function(a){return function(b,c){return("DESC"==b||"ASC"==b)&&(b=c+"_"+b),"0"==b&&(b="1"),"undefined"==typeof b||"undefined"==typeof a.config.trad||"undefined"==typeof a.config.trad[b]?b:a.config.trad[b]}}]),app.filter("dedoublonne",function(){return function(a){if(void 0==a)return[];for(var b=[],c=[],d=0;d<a.length;d++)void 0==b[a[d]]&&(b[a[d]]=a[d],c.push(a[d]));return c}}),app.factory("ArticleFactory",["$http","$rootScope","$q",function(a,b,c){var d={URL:"",articles:!1,filterOld:"",article:[],themes:!1,entity_types:!1,rubriques:!1,typesRealisation:!1,typesTravaux:!1,fabricants:!1,categories:!1,nbArtMax:36,nbPub:8,entity_default:"article_edito OR produitheque_produit OR reseau_realisation",emplacementPub:function(a){if(a>0){var b=d.nbArtMax/d.nbPub,c=a%Math.floor(b);return 0==c}return!1},getArticles:function(e){b.config.loader=!0;var f=c.defer();if("undefined"!=typeof e&&angular.toJson(e)!=d.filterOld&&(d.filterOld=angular.toJson(e),d.articles=!1),d.articles!==!1)f.resolve(d.articles),b.config.loader=!1;else{var g="http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?nb_item="+d.nbArtMax;if("undefined"!=typeof e){var h="";h=1==e.sort_order_date_or_relevance?"date":"score","undefined"!=typeof e.keywords?g=g+"&KEYWORDS="+e.keywords:h="date",g=g+"&SORT_ORDER="+h+"|DESC","undefined"!=typeof e.theme&&(g=g+"&themeFILTER="+encodeURIComponent(e.theme)),g="undefined"!=typeof e.entity_type?g+"&ENTITY="+e.entity_type:g+"&ENTITY="+d.entity_default,"undefined"!=typeof e.rubrique&&(g=g+"&rubriqueFILTER="+e.rubrique),"undefined"!=typeof e.type_realisation&&(g=g+"&type_realFILTER="+e.type_realisation),"undefined"!=typeof e.type_travaux&&(g=g+"&type_travFILTER="+e.type_travaux),"undefined"!=typeof e.fabricant&&(g=g+"&fabricantFILTER="+e.fabricant),"undefined"!=typeof e.page&&(g=g+"&N="+e.page),"undefined"!=typeof e.manual&&(g=g+"&manualFILTER="+e.manual)}else g=g+"&ENTITY="+d.entity_default;d.URL=g,a.get(g).success(function(a,c){d.articles=a,"undefined"!=typeof a&&"undefined"!=typeof a.facets&&("undefined"!=typeof a.facets.entity_type&&(d.entity_types=[],angular.forEach(a.facets.entity_type,function(a){d.entity_types.push(a)})),"undefined"!=typeof a.facets.theme&&(d.themes=a.facets.theme),"undefined"!=typeof a.facets.rubrique&&(d.rubriques=a.facets.rubrique),"undefined"!=typeof a.facets.type_realisation&&(d.typesRealisation=a.facets.type_realisation),"undefined"!=typeof a.facets.type_travaux&&(d.typesTravaux=a.facets.type_travaux),"undefined"!=typeof a.facets.fabricant&&(d.fabricants=a.facets.fabricant),"undefined"!=typeof a.facets.categorie&&(d.categorie=a.facets.categorie)),""==d.articles&&(d.articles="Désolé, votre recherche n'a pas abouti."),f.resolve(d.articles),b.config.loader=!1}).error(function(a,b){f.reject("Impossible de récupérer les articles")})}return f.promise},getArticle:function(b){var e=c.defer();return void 0!==d.article[b]?e.resolve(d.article[b]):a.get("http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?ID="+b).success(function(a,c){d.article[b]=a.items,e.resolve(d.article[b])}).error(function(a,b){e.reject("Impossible de récupérer l'article")}),e.promise},getEntityTypes:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.entity_types)},1e3),a.promise},getThemes:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.themes)},1e3),a.promise},getRubriques:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.rubriques)},1e3),a.promise},getTypesRealisation:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.typesRealisation)},1e3),a.promise},getTypesTravaux:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.typesTravaux)},1e3),a.promise},getFabricants:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.fabricants)},1e3),a.promise},getCategories:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.categories)},1e3),a.promise}};return d}]),app.factory("ConfigFactory",["$http","$q",function(a,b){var c={res:{},URLConfTrad:"scripts/config/trad.json",getTrad:function(){var c=b.defer();return a.get(this.URLConfTrad).success(function(a,b){this.res=a,c.resolve(this.res)}).error(function(a,b){c.reject("Impossible de récupérer la traduction")}),c.promise}};return c}]),app.factory("PubFactory",["$http","$q",function(a,b){var c={pubs:!1,URLPub:"http://capinfoproreport.batiactu.com/cap_pub/scripts/get-pub-support-emplacement.php?e=DROITE1&JSON",getPubs:function(){var d=b.defer();return c.pubs!==!1?d.resolve(c.pubs):a.get(c.URLPub).success(function(a,b){angular.forEach(a,function(a,b){-1==a.fichier.indexOf("swf")&&""!=a.fichier&&(0==c.pubs&&(c.pubs=[]),c.pubs.push(a))}),d.resolve(c.pubs)}).error(function(a,b){d.reject("Impossible de récupérer les pubs")}),d.promise},getRandomPub:function(a){var b=Math.floor(Math.random()*a.length)+1;return a[b]}};return c}]),app.factory("CompteFactory",["$http","$rootScope","$q",function(a,b,c){var d={facets:!1,themes:!1,rubriques:!1,typesRealisation:!1,typesTravaux:!1,fabricants:!1,getAllFacets:function(e){b.config.loader=!0;var f=c.defer();if(d.facets!==!1)f.resolve(d.facets),b.config.loader=!1;else{var g="http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php";a.get(g).success(function(a,c){d.facets=a.facets,""==d.facets&&(d.facets="Désolé, votre recherche n'a pas abouti."),f.resolve(d.facets),b.config.loader=!1}).error(function(a,b){f.reject("Impossible de récupérer les facets")})}return f.promise},getThemes:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.facets.theme)},1e3),a.promise},getRubriques:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.facets.rubrique)},1e3),a.promise},getTypesRealisation:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.facets.types_realisation)},1e3),a.promise},getTypesTravaux:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.facets.types_travaux)},1e3),a.promise},getFabricants:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.facets.fabricant)},1e3),a.promise}};return d}]),app.factory("GroupeFactory",["$http","$rootScope","$q",function(a,b,c){var d={groupes:!1,categories:!1,getGroupes:function(e){b.config.loader=!0;var f=c.defer();if("undefined"!=typeof e&&angular.toJson(e)!=d.filterOld&&(d.filterOld=angular.toJson(e),d.groupes=!1),d.groupes!==!1)f.resolve(d.groupes),b.config.loader=!1;else{var g="http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?ENTITY=reseau_groupe";if("undefined"!=typeof e){var h="";h=1==e.sort_order_date_or_relevance?"date":"score","undefined"!=typeof e.keywords?g=g+"&KEYWORDS="+e.keywords:h="date",g=g+"&SORT_ORDER="+h+"|DESC","undefined"!=typeof e.categorie&&(g=g+"&categorieFILTER="+encodeURIComponent(e.categorie)),"undefined"!=typeof e.page&&(g=g+"&N="+e.page)}a.get(g).success(function(a,c){d.groupes=a,"undefined"!=typeof a&&"undefined"!=typeof a.facets&&"undefined"!=typeof a.facets.categorie&&(d.categories=a.facets.categorie),""==d.groupes&&(d.groupes="Désolé, votre recherche n'a pas abouti."),f.resolve(d.groupes),b.config.loader=!1}).error(function(a,b){f.reject("Impossible de récupérer les groupes")})}return f.promise},getCategories:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.categories)},1e3),a.promise}};return d}]),app.factory("RealisationFactory",["$http","$rootScope","$q",function(a,b,c){var d={URL:"",articles:!1,article:[],entity_types:!1,typesRealisation:!1,typesTravaux:!1,getArticles:function(e){b.config.loader=!0;var f=c.defer();if("undefined"!=typeof e&&angular.toJson(e)!=d.filterOld&&(d.filterOld=angular.toJson(e),d.articles=!1),d.articles!==!1)f.resolve(d.articles),b.config.loader=!1;else{var g="http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?nb_item=36&ENTITY=reseau_realisation";console.log(g),"undefined"!=typeof e&&("undefined"!=typeof e.type_realisation&&(g=g+"&type_realFILTER="+e.type_realisation),"undefined"!=typeof e.type_travaux&&(g=g+"&type_travFILTER="+e.type_travaux),"undefined"!=typeof e.page&&(g=g+"&N="+e.page),"undefined"!=typeof e.manual&&(g=g+"&manualFILTER="+e.manual)),a.get(g).success(function(a,c){console.log(g),d.articles=a,"undefined"!=typeof a&&"undefined"!=typeof a.facets&&("undefined"!=typeof a.facets.type_realisation&&(d.typesRealisation=a.facets.type_realisation),"undefined"!=typeof a.facets.type_travaux&&(d.typesTravaux=a.facets.type_travaux)),""==d.articles&&(d.articles="Désolé, votre recherche n'a pas abouti."),f.resolve(d.articles),b.config.loader=!1}).error(function(a,b){f.reject("Impossible de récupérer les articles")})}return f.promise},getArticle:function(b){var e=c.defer();return void 0!==d.article[b]?e.resolve(d.article[b]):a.get("http://demo.batiactu.info/webServiceSolarium/solarium3/scripts/ws.php?ID="+b).success(function(a,c){d.article[b]=a.items,e.resolve(d.article[b])}).error(function(a,b){e.reject("Impossible de récupérer l'article")}),e.promise},getTypesRealisation:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.typesRealisation)},1e3),a.promise},getTypesTravaux:function(){var a=c.defer();return setTimeout(function(){a.resolve(d.typesTravaux)},1e3),a.promise}};return d}]),app.controller("ArticleDetailsCtrl",["$scope","ArticleFactory","$log","$routeParams","$route","$filter","$location",function(a,b,c,d,e,f,g){a.article=!1,a.rubriques=!1,a.fabricants=!1,a.typesRealisation=!1,a.page=void 0==d.page?1:d.page,a.$routeParams=d,a.$location=g,a.$log=c,a.unArticle={},a.realisations_preferees=JSON.parse(localStorage.getItem("realisations_preferees")),jQuery("#favoriInfoAdd").hide(),jQuery("#favoriInfoDelete").hide(),b.getArticle(d.id).then(function(b){a.article=b[0],a.unArticle=a.fromJJson(a.article.zs_json)}),a.changeTemplate=function(a){return"views/templates/"+a+".html"},a.retourRecherche=function(a){"reseau_realisation"==a?g.path("/realisations"):"article_edito"==a?g.path("/actualites"):"produitheque_produit"==a?g.path("/produits"):"reseau_groupe"==a?g.path("/groupes"):g.path("/")},a.fromJJson=function(a){return angular.fromJson(a)},a.imgResize=function(a){var b=a.replace("medium","medium_auto/300-200-c");return b},a.imgResizeToBig=function(a){var b=a.replace("medium","big");return b},a.upperCaseFirstChar=function(a){return stringUpper=a.charAt(0).toUpperCase()+a.slice(1),stringUpper},a.comptePage=function(a){return null==a||void 0==a?"":a.length+1},a.int_val=function(a){return parseInt(a)},a.lienPhoto=function(a,b){var c;for(c=0;c<a.length;c++)if(parseInt(a[c].page)==b){var d=(a[c].photo.fichier1,a[c].taille);return{fichier:a[c].photo.fichier1,taille:d}}return{}},a.precSuiv=function(){var a,c=-1,e="",f="",g="",h="",i="",j="";if(b.articles){if(void 0==b.articles.items)return{};for(a=0;a<b.articles.items.length;a++)b.articles.items[a].id==d.id&&(c=a);if(0==c){if(void 0!=b.articles.items&&void 0!=b.articles.items[c+1]){var h=b.articles.items[c+1].id,i=b.articles.items[c+1].label;if(void 0!=b.articles.items[c+1].sm_image_url&&void 0!=b.articles.items[c+1].sm_image_url[0])var j=b.articles.items[c+1].sm_image_url[0];else var j=null}}else if(c==b.articles.items.length-1){if(void 0!=b.articles.items&&void 0!=b.articles.items[c-1]){var e=b.articles.items[c-1].id,f=b.articles.items[c-1].label;if(void 0!=b.articles.items[c-1].sm_image_url&&void 0!=b.articles.items[c-1].sm_image_url[0])var g=b.articles.items[c-1].sm_image_url[0];else var g=null}}else{if(void 0!=b.articles.items&&void 0!=b.articles.items[c-1]){var e=b.articles.items[c-1].id,f=b.articles.items[c-1].label;if(void 0!=b.articles.items[c-1].sm_image_url&&void 0!=b.articles.items[c-1].sm_image_url[0])var g=b.articles.items[c-1].sm_image_url[0];else var g=null}if(void 0!=b.articles.items&&void 0!=b.articles.items[c+1]){var h=b.articles.items[c+1].id,i=b.articles.items[c+1].label;if(void 0!=b.articles.items[c+1].sm_image_url&&void 0!=b.articles.items[c+1].sm_image_url[0])var j=b.articles.items[c+1].sm_image_url[0];else var j=null}}return{idPrec:e,labelPrec:f,imgPrec:g,idSuiv:h,labelSuiv:i,imgSuiv:j}}return{}},a.pagePrecedente=function(b,c){a.int_val(a.page)>1&&g.path("/articles/"+d.id+"/"+(a.int_val(a.page)-1))},a.pageSuivante=function(b,c){a.int_val(a.page)<a.comptePage(c.TPage)&&g.path("/articles/"+d.id+"/"+(a.int_val(a.page)+1))},a.repeteFakeArticles=function(a){return new Array(a)},a.ajoutRealisationPreferee=function(b){null==a.realisations_preferees&&(a.realisations_preferees={}),"undefined"==typeof a.realisations_preferees[b.entity_id]?(a.realisations_preferees[b.entity_id]=b,jQuery("#ajout-real-favoris").text("Retirer cette réalisation des favoris"),jQuery("#favoriInfoAdd").fadeIn(),setTimeout(function(){jQuery("#favoriInfoAdd").fadeOut()},1500)):(delete a.realisations_preferees[b.entity_id],jQuery("#ajout-real-favoris").text("Ajouter cette réalisation aux favoris"),jQuery("#favoriInfoDelete").fadeIn(),setTimeout(function(){jQuery("#favoriInfoDelete").fadeOut()},1500)),localStorage.setItem("realisations_preferees",JSON.stringify(a.realisations_preferees))},a.checkRealinFav=function(b){return null==a.realisations_preferees&&(a.realisations_preferees={}),"undefined"==typeof a.realisations_preferees[b.entity_id]?"Ajouter":"Retirer"},jQuery("#toBigImg").fancybox(),jQuery(document).ready(function(){jQuery(".fancybox-button").fancybox({prevEffect:"none",nextEffect:"none",closeBtn:!1,helpers:{title:{type:"inside"},buttons:{}}})})}]),app.controller("ArticlesCtrl",["$scope","$log","$location","$route","ArticleFactory","$filter","$anchorScroll",function(a,b,c,d,e,f,g){a.articles=!1,a.themes=!1,a.entity_types=!1,a.rubriques=!1,a.types_realisation=!1,a.types_travaux=!1,a.fabricants=!1,a.nb_page=0,a.ws=!1,a.factory=e,a.$location=c,a.$log=b,a.Math=window.Math;var h=JSON.parse(localStorage.getItem("user"));(null==h||void 0==h.isConnected||1!=h.isConnected)&&c.path("/identification"),a.accesBarreBasse="$location.path()=='/' || $location.path()=='/actualites' || $location.path()=='/produits' || $location.path()=='/realisations' || $location.path()=='/compte' || $location.path()=='/groupes' || $location.path()=='/filactu' || $location.path()=='/gestionFilActu' || $location.path()=='/discussions' || $location.path()=='/gestion_realisations' || location.path()=='/parametres_appli'",a.accesBarreHaute="$location.path()=='/' || $location.path()=='/actualites' || $location.path()=='/produits' || $location.path()=='/realisations' || $location.path()=='/compte' || $location.path()=='/groupes' || $location.path()=='/filactu' || $location.path()=='/gestionFilActu'",a.accesMenuToggle="$location.path()=='/' || $location.path()=='/actualites' || $location.path()=='/produits' || $location.path()=='/realisations'",a.accesFooter="$location.path()!='/identification' && $location.path()!='/inscription' && $location.path()!='/connexion' && $location.path()!='/compte'","/actualites"==c.path()&&(angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.entity_type="article_edito",a.filter.sort_order_date_or_relevance=!1,a.filter.switch_label="Date"),"/produits"==c.path()&&(angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.entity_type="produitheque_produit",a.filter.sort_order_date_or_relevance=!1,a.filter.switch_label="Date"),"/realisations"==c.path()&&(angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.entity_type="reseau_realisation",a.filter.sort_order_date_or_relevance=!1,a.filter.switch_label="Date"),"/groupes"==c.path()&&(angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.entity_type="reseau_groupe",a.filter.sort_order_date_or_relevance=!1,a.filter.switch_label="Date"),("/"==c.path||"/actualites"==c.path||"/produits"==c.path||"/realisations"==c.path||"/groupes"==c.path)&&("article_edito"==a.filter.entity_type&&c.path("/actualites"),"produitheque_produit"==a.filter.entity_type&&c.path("/produits"),"reseau_realisation"==a.filter.entity_type&&c.path("/realisations"),"reseau_groupe"==a.filter.entity_type&&c.path("/groupes")),a.int_val=function(a){return parseInt(a)},e.getArticles(a.filter).then(function(b){a.articles=b.items,a.facets=b.facets,a.ws=b}),a.search=function(b){""==a.filter.keywords&&delete a.filter.keywords,e.getArticles(b).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.videEntity=function(){delete a.filter.entity_type,delete a.filter.rubrique,delete a.filter.theme,delete a.filter.fabricant,delete a.filter.type_realisation,"/"==c.path()?d.reload():c.path("/")},a.switchDateAndRelevance=function(){a.filter.switch_label=1==a.filter.sort_order_date_or_relevance?"Pertinence":"Date",e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.filterPage=function(b){a.filter.page=b,e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.sortByTheme=function(b){angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.theme=b,a.filter.entity_type="article_edito",jQuery("#sidebar-wrapper").removeClass("active"),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.sortByEntityType=function(b){a.filter.entity_type=b,jQuery("#sidebar-wrapper").removeClass("active"),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.sortByRubrique=function(b){angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.entity_type="article_edito",a.filter.rubrique=b,jQuery("#sidebar-wrapper").removeClass("active"),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.sortByTypeRealisation=function(b){angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.type_realisation=b,a.filter.entity_type="reseau_realisation",jQuery("#sidebar-wrapper").removeClass("active"),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.sortByTypeTravaux=function(b){angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.type_travaux=b,a.filter.entity_type="reseau_realisation",jQuery("#sidebar-wrapper").removeClass("active"),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.sortByFabricants=function(b){angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.fabricant=b,a.filter.entity_type="produitheque_produit",jQuery("#sidebar-wrapper").removeClass("active"),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b,c.hash("top"),g()})},a.sortByCategories=function(b){angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.categorie=b,e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b,c.hash("top")}),c.hash("top"),g(),console.log(a.filter)},e.getThemes().then(function(b){a.menuToggle.themes=b}),e.getRubriques().then(function(b){a.menuToggle.rubriques=b}),e.getTypesRealisation().then(function(b){a.menuToggle.types_realisation=b}),e.getTypesTravaux().then(function(b){a.menuToggle.types_travaux=b}),e.getFabricants().then(function(b){a.menuToggle.fabricants=b}),a.removeFilter=function(b,c){delete a.filter[b],e.getArticles(a.filter).then(function(b){a.articles=b.items,a.ws=b}),e.getEntityTypes().then(function(b){a.menuToggle.entity_types=b})},a.removeAllFilters=function(b){angular.forEach(b,function(b,c){delete a.filter[c]}),e.getArticles(b).then(function(b){a.articles=b.items,a.ws=b}),c.path("/"),d.reload(),e.getEntityTypes().then(function(b){a.menuToggle.entity_types=b}),a.filter.sort_order_date_or_relevance=!1,a.filter.switch_label="Date"},a.repeteFakeArticles=function(a){return new Array(a)},a.fixText=function(a,b){return a.substr(0,b)+"..."},a.deconnexion=function(){localStorage.removeItem("user"),c.path("/identification")},a.URL=e.URL+"&DEBUG=1",a.closeMenuFiltres=function(){jQuery("#sidebar-wrapper").removeClass("active")}}]),app.controller("PubCtrl",["$scope","$log","PubFactory",function(a,b,c){a.pubs=!1,a.pubFactory=c,a.$log=b,c.getPubs().then(function(b){a.pubs=b,a.pub=c.getRandomPub(a.pubs)})}]),app.controller("IdentificationCtrl",["$scope","$location",function(a,b){a.user={email:"",password:""},console.log("toto");var c=a.slides=[];c.push({icon:"fa-newspaper-o",image:"images/image1.jpg",text:"Des milliers d'articles n'attendent que vous",title:"Découvrez les actualités et produits de Batiactu"}),c.push({icon:"fa-user-plus",image:"images/image3.jpg",text:"Connectez-vous et rencontrez des membres et leurs réalisations",title:"Créez votre réseau"}),c.push({icon:"fa-briefcase",image:"images/image7.jpg",text:"Consultez, recherchez et sauvegardez les articles, produits et réalisations de Batiactu",title:"Trouvez vos futurs travaux ou laissez-les vous trouver"}),c.push({icon:"fa-comments-o",image:"images/image4.jpg",text:"Commentez les articles ou réalisations et participez aux disscussions de Batiactu",title:"Rendez-vous acteur de la communauté"}),c.push({icon:"fa-file-text-o",image:"images/image5.jpg",text:"Ouvrez la porte aux opportunités",title:"Créez votre profil"}),a.identification=function(){var c={etat:"OK",info_user:{name:"Federer",firstname:"Roger"}};"OK"==c.etat?(a.user.nom=c.info_user.name,a.user.prenom=c.info_user.firstname,a.user.isConnected=!0,localStorage.setItem("user",JSON.stringify(a.user)),b.path("/")):jQuery("#erreur-connexion").removeClass("hide")},console.log("khg")}]),app.controller("CompteCtrl",["$scope","$log","$location","$route","CompteFactory","$filter","$anchorScroll",function(a,b,c,d,e,f,g){a.factory=e,a.$location=c,a.$log=b,console.log(c.path()),jQuery("#favoriInfoAdd").hide(),jQuery("#favoriInfoDelete").hide();var h=JSON.parse(localStorage.getItem("preferences_user_theme")),i=JSON.parse(localStorage.getItem("preferences_user_rubrique")),j=JSON.parse(localStorage.getItem("preferences_user_type_real")),k=JSON.parse(localStorage.getItem("preferences_user_fabricant"));null==h&&(h={}),null==i&&(i={}),null==j&&(j={}),null==k&&(k={}),a.pref_user.themes=h,a.pref_user.rubriques=i,a.pref_user.types_realisation=j,a.pref_user.fabricants=k,e.getAllFacets().then(function(b){a.facets=b}),setTimeout(function(){"/gestionFilActu"==c.path()&&angular.forEach(a.pref_user.themes,function(a){angular.element(document.querySelector("#"+a.id)).addClass("text-success"),angular.element(document.querySelector("#span"+a.id)).addClass("fa fa-check")})},1500),setTimeout(function(){"/gestionFilActu"==c.path()&&angular.forEach(a.pref_user.rubriques,function(a){angular.element(document.querySelector("#"+a.id)).addClass("text-success"),angular.element(document.querySelector("#span"+a.id)).addClass("fa fa-check")})},1500),setTimeout(function(){"/gestionFilActu"==c.path()&&angular.forEach(a.pref_user.types_realisation,function(a){angular.element(document.querySelector("#"+a.id)).addClass("text-success"),angular.element(document.querySelector("#span"+a.id)).addClass("fa fa-check")})},1500),setTimeout(function(){"/gestionFilActu"==c.path()&&angular.forEach(a.pref_user.fabricants,function(a){angular.element(document.querySelector("#"+a.id)).addClass("text-success"),angular.element(document.querySelector("#span"+a.id)).addClass("fa fa-check")})},1500),a.triAlphabetique=function(a,b){return a.name<b.name?-1:a.name==b.name?0:1},a.triFavoris=function(b){if(void 0==b||0==b)return"";var c=b.sort(a.triAlphabetique);return c},a.addThemeToFav=function(b,c){var d="th_"+c;jQuery("#"+d).toggleClass("text-success"),jQuery("#span"+d).toggleClass("fa-check"),"undefined"==typeof a.pref_user.themes[b]?(a.pref_user.themes[b]={theme:b,id:d},jQuery("#favoriInfoAdd span").text("Le thème "+b),jQuery("#favoriInfoAdd").fadeIn(),setTimeout(function(){jQuery("#favoriInfoAdd").fadeOut()},1e3)):(delete a.pref_user.themes[b],jQuery("#favoriInfoDelete span").text("Le thème "+b),jQuery("#favoriInfoDelete").fadeIn(),setTimeout(function(){jQuery("#favoriInfoDelete").fadeOut()},1e3)),localStorage.setItem("preferences_user_theme",JSON.stringify(a.pref_user.themes))},a.addRubriqueToFav=function(b,c){var d="rub_"+c;jQuery("#"+d).toggleClass("text-success"),jQuery("#span"+d).toggleClass("fa-check"),"undefined"==typeof a.pref_user.rubriques[b]?(a.pref_user.rubriques[b]={rubrique:b,id:d},jQuery("#favoriInfoAdd span").text("La rubrique "+b),jQuery("#favoriInfoAdd").fadeIn(),setTimeout(function(){jQuery("#favoriInfoAdd").fadeOut()},1e3)):(delete a.pref_user.rubriques[b],jQuery("#favoriInfoDelete span").text("La rubrique "+b),jQuery("#favoriInfoDelete").fadeIn(),setTimeout(function(){jQuery("#favoriInfoDelete").fadeOut()},1e3)),localStorage.setItem("preferences_user_rubrique",JSON.stringify(a.pref_user.rubriques))},a.addTypeRealToFav=function(b,c){var d="real_"+c;jQuery("#"+d).toggleClass("text-success"),jQuery("#span"+d).toggleClass("fa-check"),"undefined"==typeof a.pref_user.types_realisation[b]?(a.pref_user.types_realisation[b]={type_real:b,id:d},jQuery("#favoriInfoAdd span").text("Le type de réalisation "+b),jQuery("#favoriInfoAdd").fadeIn(),setTimeout(function(){jQuery("#favoriInfoAdd").fadeOut()},1e3)):(delete a.pref_user.types_realisation[b],jQuery("#favoriInfoDelete span").text("Le type de réalisation "+b),jQuery("#favoriInfoDelete").fadeIn(),setTimeout(function(){jQuery("#favoriInfoDelete").fadeOut()},1e3)),localStorage.setItem("preferences_user_type_real",JSON.stringify(a.pref_user.types_realisation))},a.addFabricantToFav=function(b,c){var d="fab_"+c;console.log(b),jQuery("#"+d).toggleClass("text-success"),jQuery("#span"+d).toggleClass("fa-check"),"undefined"==typeof a.pref_user.fabricants[b]?(a.pref_user.fabricants[b]={fabricant:b,id:d},jQuery("#favoriInfoAdd span").text("Le fabricant "+b),jQuery("#favoriInfoAdd").fadeIn(),setTimeout(function(){jQuery("#favoriInfoAdd").fadeOut()},1e3)):(delete a.pref_user.fabricants[b],jQuery("#favoriInfoDelete span").text("Le fabricant "+b),jQuery("#favoriInfoDelete").fadeIn(),setTimeout(function(){jQuery("#favoriInfoDelete").fadeOut()},1e3)),localStorage.setItem("preferences_user_fabricant",JSON.stringify(a.pref_user.fabricants))},a.deletePrefs=function(){localStorage.removeItem("preferences_user_theme"),localStorage.removeItem("preferences_user_rubrique"),localStorage.removeItem("preferences_user_type_real"),localStorage.removeItem("preferences_user_fabricant")}}]),app.controller("FilActuCtrl",["$scope","$log","$location","$route","ArticleFactory","$filter","$anchorScroll",function(a,b,c,d,e,f,g){a.articles=!1,a.themes=!1,a.entity_types=!1,a.rubriques=!1,a.types_realisation=!1,a.types_travaux=!1,a.fabricants=!1,a.nb_page=0,a.ws=!1,a.factory=e,a.$location=c,a.$log=b,a.Math=window.Math,a.filter2={};var h=JSON.parse(localStorage.getItem("preferences_user_theme")),i=JSON.parse(localStorage.getItem("preferences_user_rubrique")),j=JSON.parse(localStorage.getItem("preferences_user_type_real")),k=JSON.parse(localStorage.getItem("preferences_user_fabricant"));null==h&&(h={}),null==i&&(i={}),null==j&&(j={}),null==k&&(k={}),a.pref_user.themes=h,a.pref_user.rubriques=i,a.pref_user.types_realisation=j,a.pref_user.fabricants=k,a.int_val=function(a){return parseInt(a)};var l=!0;angular.forEach(h,function(b){l?a.filter2.manual="sm_theme:"+b.theme:a.filter2.manual+=" OR sm_theme:"+b.theme,l=!1}),angular.forEach(i,function(b){l?a.filter2.manual="sm_rubrique:"+b.rubrique:a.filter2.manual+=" OR sm_rubrique:"+b.rubrique,l=!1}),angular.forEach(j,function(b){l?a.filter2.manual="ss_type_real:"+b.type_real:a.filter2.manual+=" OR ss_type_real:"+b.type_real,l=!1}),angular.forEach(k,function(b){l?a.filter2.manual="ss_indus:"+b.fabricant:a.filter2.manual+=" OR ss_indus:"+b.fabricant,l=!1}),e.getArticles(a.filter2).then(function(b){a.articles=b.items,a.facets=b.facets,a.ws=b}),a.search=function(b){""==a.filter2.keywords&&delete a.filter2.keywords,e.getArticles(b).then(function(b){a.articles=b.items,a.ws=b})},a.switchDateAndRelevance=function(){a.filter2.switch_label=1==a.filter2.sort_order_date_or_relevance?"Pertinence":"Date",e.getArticles(a.filter2).then(function(b){a.articles=b.items,a.ws=b})},a.filterPage=function(b){console.log(b),a.filter2.page=b,e.getArticles(a.filter2).then(function(b){a.articles=b.items,a.ws=b}),c.hash("top"),g()},a.repeteFakeArticles=function(a){return new Array(a)}}]),app.controller("GroupesCtrl",["$scope","$log","$location","$route","GroupeFactory","$filter","$anchorScroll","$routeParams",function(a,b,c,d,e,f,g,h){a.groupe=!1,a.groupes=!1,a.categories=!1,a.nb_page=0,a.ws=!1,a.factory=e,a.$location=c,a.$log=b,a.Math=window.Math,a.int_val=function(a){return parseInt(a)},e.getGroupes(a.filter).then(function(b){a.groupes=b.items,a.categories=b.facets.categorie,a.ws=b}),e.getGroupes(h.id).then(function(b){a.groupe=b[0]}),a.search=function(b){""==a.filter.keywords&&delete a.filter.keywords,e.getGroupes(b).then(function(b){a.groupes=b.items,a.ws=b})},a.switchDateAndRelevance=function(){a.filter.switch_label=1==a.filter.sort_order_date_or_relevance?"Pertinence":"Date",e.getGroupes(a.filter).then(function(b){a.groupes=b.items,a.ws=b})},a.filterPage=function(b){a.filter.page=b,e.getGroupes(a.filter).then(function(b){a.groupes=b.items,a.ws=b}),c.hash("top"),g()},a.sortByCategories=function(b){
angular.forEach(a.filter,function(b,c){delete a.filter[c]}),a.filter.categorie=b,e.getGroupes(a.filter).then(function(b){a.groupes=b.items,a.ws=b}),c.hash("top"),g()},e.getCategories().then(function(b){a.categories=b}),a.fixText=function(a,b){return a.substr(0,b)+"..."},a.getInitials=function(a){var b=[];for(i=0;i<a.split(" ").length;i++)b.push(a.split(" ")[i].substr(0,1).toUpperCase()+".");return void 0!==b[1]&&void 0==b[2]?b[0]+b[1]:void 0!==b[1]&&void 0!==b[2]?b[0]+b[1]+b[2]:b[0]}}]),app.controller("RealisationsCtrl",["$scope","$log","$location","$route","RealisationFactory","$filter","$anchorScroll",function(a,b,c,d,e,f,g){a.articles=!1,a.types_realisation=!1,a.types_travaux=!1,a.factory=e,a.$location=c,a.$log=b,a.listeMois=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];var h=function(){var a=(new Date).getFullYear(),b=[];for(i=a;i>=2e3;i--)b.push(i);return b};a.listeAnnees=h(),e.getArticles(a.filter).then(function(b){a.articles=b.items,a.facets=b.facets,a.ws=b}),e.getTypesRealisation().then(function(b){a.menuToggle.types_realisation=b}),e.getTypesTravaux().then(function(b){a.menuToggle.types_travaux=b})}]),app.controller("RealPrefCtrl",["$scope","$location",function(a,b){var c=JSON.parse(localStorage.getItem("realisations_preferees"));a.realisations_preferees=c}]);