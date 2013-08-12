'use strict';
/**
 * User: 3lRicko
 * Date: 8/10/13
 * Time: 6:02 PM
 */

var requesting = require('request');
var AWS = require('aws-sdk');
var fs = require('fs');
var http = require('http');
var url = require('url');

//CONSTANTS

exports.copy = function(fromUrl, s3Bucket, callback){

    requesting.head(fromUrl, function(err, res){

        console.log("1");
        if(err) return callback(err);

        var contentType = res.headers['content-type'];
        if(contentType == null || contentType.indexOf('image') < 0) { return callback(new Error('Invalid image.')); }
        console.log("2");
        var fileName = new Date().valueOf() + "." + contentType.split("/")[1];
        console.log(fromUrl);
        var s3 = new AWS.S3();

        var request = http.get(fromUrl, function(res){
            var imagedata = '';
            var bufs = [];
            //res.setEncoding('binary');
            //res.setEncoding('utf8');
            //var buf = new Buffer(Number(res.headers['content-length']));

            res.on('data', function(chunk){
                imagedata += chunk
              //  buf.write(chunk, 'binary');
                bufs.push(chunk);
            });

            res.on('end', function(){
//                fs.writeFile('./'+fileName, imagedata, 'binary', function(err){
//                    if (err) throw err;
//                    console.log('File saved.')
//                });

                var size = Number(res.headers['content-length']);
                //console.log("size = " + size + " content: " + contentType, + "b length: " + buf.length );
                //okvar params = {Bucket: s3Bucket, Key: fileName, Body: new Buffer(imagedata, 'utf8'), ACL: "public-read",
                var params = {Bucket: s3Bucket, Key: fileName, Body: Buffer.concat(bufs), ACL: "public-read",
                      ContentType: contentType  };

                console.log("3");
                s3.putObject(params, function(err){

                    console.log("4");

                    try{
                    if(err){ console.log(err); return callback(err);  }

                    var toUrl = s3.endpoint.href + s3Bucket + "/" + fileName;
                    //return callback(null, toUrl);
                    console.log("5" + toUrl);
                    }catch(exx){
                        console.log(exx);
                    }
                });

            });

        });

        callback(new Error("x"));
//        request.get(fromUrl, function(err, res, data){
//
//            if(err) return callback(err);
//            console.log(res.body);
//            var params = {Bucket: s3Bucket, Key: fileName, Body: res.body, ACL: "public-read", ContentType: contentType};
//
//
//            console.log("3");
//            s3.putObject(params, function(err, res){
//
//                console.log("4");
//                console.trace(err);
//                if(err) return callback(err);
//                console.log("5");
//                var toUrl = s3.endpoint.href + s3Bucket + "/" + fileName;
//                return callback(null, toUrl);
//
//            });
//        });
    });
};
