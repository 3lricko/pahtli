/**
 * User: 3lRicko
 * Date: 8/11/13
 * Time: 6:33 PM
 */
'use strict';

var Product = require('../models/product');
var util = require('../foundation/util');


/**
 * Insert - Update.
 */
exports.save = function(product, callback) {

    try{

        Product.findById(product._id, function (err, existingPrd) {

            try{
                if(err){ util.error(err); return callback(err); }

                if (existingPrd == null) {// Insert

                    Product.create(product, function (err) {

                        if(err){ util.error(err); return callback(err); }
                        callback(null);
                    });

                } else {// Update

                    existingPrd.name = product.name;
                    existingPrd.imageUrl = product.imageUrl;
                    existingPrd.description = product.description;
                    existingPrd.prescription = product.prescription;
                    existingPrd.save();
                    callback(null);
                }

            }catch(ex) { util.error(ex); callback(ex); }

        });

    }catch(ex) { util.error(ex); callback(ex); }

};
