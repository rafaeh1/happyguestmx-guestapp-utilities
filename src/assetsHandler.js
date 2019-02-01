'use strict';

/*!
 * This module helps to get urls in format that you select
 * 0.3
 */

const imageFormats = {
    "thumbnail": "75x75",
    "thumbnail_retina": "150x150",
    "thumbnail_3x": "300x300",
    "landscape": "350x150",
    "full_image": "480x320",
    "full_image_retina": "1024x768"
};

/**
 * Get an image url from original url and desired format
 * @param {url} url
 * @param {String} format
 * @return {url}
 */
async function getImage(url, format) {
    try {
        if (url && format) {
            let newPath = url.split("?")[0];
            let arrayOfPath = newPath.split('/');
            newPath = arrayOfPath.splice(arrayOfPath.length - 1, 0, imageFormats[format]);
            newPath = arrayOfPath.join('/');
            return newPath;
        } else return url;
    }
    catch(err) {
        throw(err);
    }
}

/**
 * Get an image url from original url and desired format
 * @param {Array} gallery
 * @param {String} format
 * @return {Array}
 */
async function getImageGallery(gallery, format) {
    try {
        let thumbnails = [];
        if (gallery.length > 0) {
            await Promise.all(gallery.map(async (image) => {
                thumbnails.push(await getImage(image, format));
            }));
        }
        return thumbnails;
    }
    catch(err) {
        throw(err);
    }
}


module.exports = {
    getImage,
    getImageGallery
}