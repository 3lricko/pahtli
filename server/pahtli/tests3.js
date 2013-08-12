var AWS = require('aws-sdk');

try{

    var s3 = new AWS.S3();

    var buf = require('fs').createReadStream('./test.jpeg');

    //buf.pipe(require('fs').createWriteStream('./testCopy.jpeg'));

    var params = {Bucket: 'pahtli/img/prd', Key: 'usana.jpeg', Body: buf, ACL: "public-read" };
    //var file = require('fs').createWriteStream('./fromS3.png');

//    s3.getObject(params).createReadStream()
//        .on('error', function(err,resp){
//            console.log(resp);
//            console.log('---------');
//            console.log(err);
//        }).pipe(file);

    s3.putObject(params,function(err,res){
        if(err) console.log("ERROR!" + err);
        console.log('object uploaded' + s3.endpoint.href);
    });

}catch(err){

    console.trace(err);
}
