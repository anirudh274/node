/*  Library used for storing and editing the data */


//Dependencies
var fs = require('fs');
var path = require('path');

//Containers fot hte module (to be exported)
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/'); //we want to take directory name and normalize (...)

//write the data
lib.create = function(dir,file,data,callback){
  //Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
    if (!err && fileDescriptor){
      //convert data to string, if we throw json objects and return to a string and written to a file then when we read that back we want a normal json objects
      var stringData = JSON.stringify(data);

      //write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(err){
        if (!err) {
          fs.close(fileDescriptor, function(err){
            if (!err) {
              callback(false);
            } else {
              callback('error closing new file');
            }
          });

        } else {
          callback('error writing to new file');
        }
      });

    } else {
      callback('could not crete new file, it may already exist');
    }
  });
};

//Read data from a file
lib.read = function(dir, file,callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err, data){
    callback(err,data);
  });//will read contents of file
};

//uPDATE data inside a file
lib.update = function(dir,file,data,callback){
  //open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+', function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      //convert data to string, if we throw json objects and return to a string and written to a file then when we read that back we want a normal json objects
      var stringData = JSON.stringify(data);

      //Truncate the content of the file
      fs.truncate(fileDescriptor,function(err){
        if (!err) {
          //write to the file and close it
          fs.writeFile(fileDescriptor,stringData,function(err){
            if (!err) {
              fs.close(fileDescriptor,function(err){
                if (!err){
                  callback(false);
                }else {
                  callback('error closing the existing file');
                }
              });

            }else {
              callback('error writing to existing file');
            }
          });

        } else {
          callback('error truncating the file');

        }
      });
    }else {
      callback('could not open the file for updating, it may not exist yet');
    }
  });
};

//Delete a file
lib.delete = function(dir,file,callback){
  //unlink the file
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
    if (!err) {
      callback(false);
    } else {
      callback('error deleting the file');
    }
  });

};

//export the module
module.exports = lib;
