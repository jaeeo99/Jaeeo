/**
 * Created by Jaeeo on 15. 7. 1..
 */

var my_app = angular.module('Jaeeo', ['ng.django.forms', 'ngCookies', 'ui.bootstrap']).config(function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

var GOOGLE_API_KEY = "AIzaSyCH8SzDt8nCXEg_rWl2KkLNK3gKRJ21C8w";

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}

function isNull(data){
    if(data == null || data == undefined || data == ""){
        return true;
    }
    else{
        return false;
    }
}

function shuffle(list){
    for(var j, x, i = list.length; i; j = Math.floor(Math.random() * i), x = list[--i], list[i] = list[j], list[j] = x);
    return list;
}