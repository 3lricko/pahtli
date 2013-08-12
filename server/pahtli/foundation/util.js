/**
 * User: 3lRicko
 * Date: 8/11/13
 * Time: 5:50 PM
 */

//LOGGER
exports.error = function(exception){

    console.trace(exception);
};

exports.fatal = function(exception){

    console.trace(exception);
};

exports.info = function(exception){

    console.log(exception);
};

//SERVICES
exports.serviceResponse = function(res, err, resData){

    res.send(err ? err.message : (resData ? resData : "ok"));
};
