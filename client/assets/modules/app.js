(function () {
    'use strict';

    function config($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    function run() {
        FastClick.attach(document.body);
    }
    angular.module('application', [
        'ui.router',
        'ngAnimate',
        'xeditable',
        //app modules
        'core',
        'auth',
        'account',
        'usermanagement',
        //foundation
        'foundation',
        'foundation.dynamicRouting',
        'foundation.dynamicRouting.animations'
    ])
        .config(config)
        .constant('API_URL', '/api')
        .run(run);
})();