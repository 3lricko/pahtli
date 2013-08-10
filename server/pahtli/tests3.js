var AWS = require('aws-sdk');
//AWS.config.update({region: 'us-standard'});

try{
var s3 = new AWS.S3();
var params = {Bucket: 'pahtli/img/prd', Key: 'rubFlamencoRojo.png'};
var file = require('fs').createWriteStream('./fromS3.png');
var reader = s3.getObject(params).createReadStream();
reader.on('error', function(err,resp){
	console.log(resp);
	console.log('---------');
	console.log(err);
	}).pipe(file);
}catch(err){
	console.trace(err);
}
