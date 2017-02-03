const imageSchema = require('../model/imageSchema');

const showAll = function (callback) {
    imageSchema.find((err, images) => {
        if (err) {
            console.log(err);
        }

        if (!images) {
            console.log(err)
        }

        callback(err, images);
    });
};

const createImage = function (imageData, callback) {
    imageData.save(function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
};

module.exports.showAll = showAll;
 module.exports.createImage = createImage;
