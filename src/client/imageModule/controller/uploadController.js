"use strict";
export default ['$scope', 'imageService', 'Upload', function ($scope, imageService, Upload) {

    $scope.submit = () => {
        if ($scope.upload_form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };
    $scope.upload = (file) => {
        Upload.upload({
            url: "http://localhost:3000/upload",
            data: {
                type: $scope.type,
                file: file
            }
        }).then(() => {

            const getFirstPart = () => {
                imageService.getFirstPart().then((data) => {
                   $scope.image1 = data.data;
                })
            };
            const getSecondPart = () => {
                imageService.getSecondPart().then((data) => {
                    $scope.image2 = data.data;
                })
            };
            const getSum = () => {
                imageService.getSum().then((data) => {
                    $scope.data = data.data;
                })
            };
            $scope.montage = imageService.getMontage;

            getSum();
            getFirstPart();
            getSecondPart();
           
        });
    };

   

}];