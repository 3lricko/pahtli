'use strict';
/**
 * User: 3lRicko
 * Date: 8/10/13
 * Time: 6:02 PM
 */

var request = require('request');
var AWS = require('aws-sdk');
var http = require('http');
var util = require('./util');

//CONSTANTS

exports.copyToS3 = function(fromUrl, bucket, callback){

    try{

        //if it's already a in the bucket...
        if(fromUrl.indexOf(bucket) > 0) return callback(null, fromUrl);

        request.head(fromUrl, function(err, res){

            try{

                if(err){ util.error(err); return callback(err);}

                var contentType = res.headers['content-type'];
                if(contentType == null || contentType.indexOf('image') < 0) { return callback(new Error('Invalid image.')); }

                var fileName = new Date().valueOf() + "." + contentType.split("/")[1];

                var req = http.get(fromUrl, function(res){

                    try{
                        var chunks = [];
                        req.on('error', function(err) {
                            util.error(err); return callback(err);
                        });

                        res.on('data', function(chunk){
                            chunks.push(chunk);
                        });
                        res.on('end', function(){
                            module.exports.uploadToS3(bucket, fileName, 'public-read', contentType, Buffer.concat(chunks), callback);
                        });
                    }catch(ex) { util.error(ex); callback(ex); }
                });

            }catch(ex) { util.error(ex); callback(ex); }
    });

    }catch(ex) { util.error(ex); callback(ex); }
};

exports.uploadToS3 = function(bucket, fileName, ACL, contentType, buffer, callback){

    var s3 = new AWS.S3();
    var params = {Bucket: bucket, Key: fileName, Body: buffer, ACL: ACL,
        ContentType: contentType  };

    try{
        var toUrl = s3.endpoint.href + bucket + "/" + fileName;
        s3.putObject(params, function(err){

            if(err){ util.error(err); return callback(err);  }

            return callback(null, toUrl);
        });
    }catch(ex) { util.error(ex); callback(ex); }
};
