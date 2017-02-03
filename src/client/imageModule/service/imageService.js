"use strict";

import {conf} from "../config/configs";

let socket = conf.host + ":" + conf.port + "/";
let montage;
export default function ($http) {
    this.getMontage = () => {
        return montage
    };
    this.getFirstPart = () => {
        return $http.get(socket + 'getFirst');
    };
    this.getSecondPart = () => {
        return $http.get(socket + 'getSecond');
    };
    this.getSum = () => {
        this.getMontageImage();
        return $http.get(socket + 'getImage');
    };
    this.getMontageImage = () => {
        return $http.get(socket + 'getMontage').then((res) => {
            montage = res.data;
            
        });
    };
};

