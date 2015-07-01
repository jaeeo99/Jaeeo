/**
 * Created by Jaeeo on 15. 7. 1..
 */

var my_app = angular.module('Jaeeo', ['ng.django.forms']).config(function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});
