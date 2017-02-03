var express = require('express');
var imageCollection = require('../repository/imageRepository');
var mongoose = require('mongoose');
var Image = require('../model/imageSchema');
var gm = require("gm");
var formidable = require('formidable');
var os = require('os');
var fs = require('fs');

var router = express.Router();
var element;

router.get('/getFirst', function (req, res) {
    mongoose.model('Image').find(function (err, data) {

        if (err) {
            res.status(404);
        }
        try {
            var lastElement = data[data.length - 1];
            var img = new Buffer(fs.readFileSync('upload/' + lastElement.pathToPartOne).toString("base64"));
            res.writeHead(200, {'Content-Type': 'image/JPEG'});
            res.end(img);
        } catch (e) {
            console.log(e)
        }


    });
});
router.get('/getSecond', function (req, res) {
    mongoose.model('Image').find(function (err, data) {
        if (err) {
            res.status(404);
        }
        try {
            var lastElement = data[data.length - 1];
            var img = new Buffer(fs.readFileSync('upload/' + lastElement.pathToPartTwo).toString("base64"));
            res.writeHead(200, {'Content-Type': 'image/JPEG'});
            res.end(img);
        }
        catch (e) {
            console.log(e)
        }


    });
});
router.get('/getMontage', function (req, res) {
    mongoose.model('Image').find(function (err, data) {
        if (err) {
            res.status(404);
        }
        try {
            var lastElement = data[data.length - 1];
            var img = new Buffer(fs.readFileSync('upload/' + lastElement.pathToMontage).toString("base64"));
            res.writeHead(200, {'Content-Type': 'image/JPEG'});
            res.end(img);
        }
        catch (e) {
            console.log(e)
        }


    });
});

router.get('/getImage', function (req, res) {
    try {
        mongoose.model('Image').find(function (err, data) {
            if (err) {
                res.status(404);
            }
            res.send('You upload ' + data.length)
        });
    }
    catch (e) {
        console.log(e);
    }

});


router.post('/upload', function (req, res) {
    try {
        mongoose.model('Image').find(function (err, data) {
            if (err) {
                res.status(404);
            }
            console.log(data.length)
            element = data.length;

            function generateFilename(filename) {
                var ext_regex = /(?:\.([^.]+))?$/;
                var ext = ext_regex.exec(filename)[1];
                var date = new Date().getTime();
                var charBank = "abcdefghijklmnopqrstuvwxyz";
                var fstring = '';
                for (var i = 0; i < 15; i++) {
                    fstring += charBank[parseInt(Math.random() * 26)];
                }
                var name = (fstring += date + '.' + ext);
                return name
            }

            var form = new formidable.IncomingForm();
            form.on('fileBegin', function (name, file) {
                file.path = form.uploadDir + "/" + file.name;
            })
            var name = 'folder-' + element;
            var d = new Date();
            var originalName;
            var type;
            var pathToFolder = __dirname + '/../../upload/' + name;
            fs.mkdir(pathToFolder, function (err, done) {
            });
            form.uploadDir = pathToFolder;
            var tmpFile, nfile, fname;
            tmpFile = '';
            nfile = '';
            fname = '';
            form.parse(req, function (err, fields, files) {

                type = fields.type;
                originalName = files.file.name;
                tmpFile = files.file.path;
                fname = generateFilename(files.file.name);
                nfile = os.tmpDir() + '/' + fname;


            });
            form.on('end', function () {


                var imgHeight, imgWidth;
                gm(tmpFile).size(function (err, value) {
                    imgHeight = value.height;
                    imgWidth = value.width;
                    editImg()

                });
                function editImg() {
                    if (type == 2) {
                        fs.rename(nfile, pathToFolder, function () {
                            gm(tmpFile)
                                .setFormat("jpg")
                                .crop(imgWidth / 2, imgHeight, 0, 0)
                                .write(pathToFolder + '/part-1.jpg', function () {
                                });
                        });

                        gm(tmpFile)
                            .setFormat("jpg")
                            .crop(imgWidth / 2, imgHeight, imgWidth / 2, 0)
                            .write(pathToFolder + '/part-2.jpg', function () {
                                    gm(pathToFolder + '/part-2.jpg').montage(pathToFolder + '/part-1.jpg')

                                        .write(pathToFolder + '/montage.jpg', function () {
                                            console.log("Written montage image.");
                                        });
                                }
                            );

                        var newImage = new Image({
                            originalName: originalName,
                            pathToImage: name + '/' + originalName,
                            pathToPartOne: name + '/' + '/part-1.jpg',
                            pathToPartTwo: name + '/' + '/part-2.jpg',
                            pathToMontage: name + '/' + '/montage.jpg',
                            description: 'crop on 2 parts'


                        });
                        imageCollection.createImage(newImage, function (err, data) {
                            if (err) throw err;
                            res.status(200).send(data);
                        })
                    }
                    else if (type == 3) {
                        fs.rename(nfile, pathToFolder, function () {
                            gm(tmpFile)
                                .setFormat("jpg")
                                .crop(imgWidth / 3, imgHeight, 0, 0)
                                .write(pathToFolder + '/part-1.jpg', function () {
                                    gm(tmpFile)
                                        .crop(imgWidth / 3, imgHeight, imgWidth / 2, 0)
                                        .write(pathToFolder + '/part-2.jpg', function () {
                                                gm(tmpFile)
                                                    .crop(imgWidth / 3, imgHeight, imgWidth / 5, 0)
                                                    .write(pathToFolder + '/part-3.jpg', function () {
                                                    });

                                                gm(pathToFolder + '/part-2.jpg').montage(pathToFolder + '/part-1.jpg')
                                                    .montage(pathToFolder + '/part-3.jpg')

                                                    .write(pathToFolder + '/montage.jpg', function () {
                                                        console.log("Written montage image.");
                                                    });
                                            }
                                        );
                                });
                        });


                        var newImage = new Image({
                            originalName: originalName,
                            pathToImage: name + '/' + originalName,
                            pathToPartOne: name + '/' + '/part-1.jpg',
                            pathToPartTwo: name + '/' + '/part-2.jpg',
                            pathToPartThree: name + '/' + '/part-2.jpg',
                            pathToMontage: name + '/' + '/montage.jpg',
                            description: 'crop on 3 parts'


                        });
                        imageCollection.createImage(newImage, function (err, data) {
                            if (err) throw err;
                            res.status(200).send(data);
                        })

                    }

                }


            })
        });
    }
    catch (e) {
        console.log(e);
    }

});

module.exports = router;