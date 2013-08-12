'use strict';
/**
 * User: 3lRicko
 * Date: 8/10/13
 * Time: 6:02 PM
 */

var request = require('request');
var AWS = require('aws-sdk');
var http = require('http');
var log = require('./logger');

//CONSTANTS

exports.copyToS3 = function(fromUrl, bucket, callback){

    request.head(fromUrl, function(err, res){

        if(err){ log.error(err); return callback(err);}

        var contentType = res.headers['content-type'];
        if(contentType == null || contentType.indexOf('image') < 0) { return callback(new Error('Invalid image.')); }

        var fileName = new Date().valueOf() + "." + contentType.split("/")[1];

        http.get(fromUrl, function(res){
            var chunks = [];

            res.on('data', function(chunk){
                chunks.push(chunk);
            });
            res.on('end', function(){

                module.exports.uploadToS3(bucket, fileName, 'public-read', contentType, Buffer.concat(chunks), callback);
            });

        });
    });
};

exports.uploadToS3 = function(bucket, fileName, ACL, contentType, buffer, callback){

    var s3 = new AWS.S3();
    var params = {Bucket: bucket, Key: fileName, Body: buffer, ACL: ACL,
        ContentType: contentType  };

    s3.putObject(params, function(err){

        if(err){ log.error(err); return callback(err);  }

        var toUrl = s3.endpoint.href + bucket + "/" + fileName;
        return callback(null, toUrl);
    });

}
