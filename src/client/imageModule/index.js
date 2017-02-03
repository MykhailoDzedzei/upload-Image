"use strict";

import angular from "angular";
import imageService from './service/imageService';
import uiRoute from 'angular-ui-router';
import uploadController from './controller/uploadController';
import uiBootstrap from 'angular-ui-bootstrap';
module.exports = angular.module("list.main", [
    uiRoute,
    require('ng-file-upload'),
    uiBootstrap
])
    .controller("uploadController", uploadController)
    .service('imageService', imageService)
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('/', {
            url:'/',
            templateUrl:"./imageModule/view/uploadTemplate.html",
            controller:'uploadController'
        });
        $urlRouterProvider.otherwise('/');

        
    });

