/* Create and export configuraiotn variables */




//Container for all envs
var environtments = {} // this will hold all of the diff envs and sub-keys,

// Staging (default) environment
environtments.staging = {
    'port' : 3000, //we can choose any number as port
    'envName' : 'staging'

};



//Production environment
environtments.production = {
    'port' : 5000, //we can choose any number as port
    'envName' : 'production'

};

//Determine which  envi was passed as a CLA 
var currentEnvironment = typeof(process.env.NODE_ENV) == 'sting' ? process.env.NODE_ENV.toLowercase() : ''; //we are using a loop where if the input is in diff format then the NODE_ENV will change it to string in lowercase or return just a normal string

// Check that the current envi  is one of the environments above, if not, default to staging
var environmentToExport = typeof(environtments[currentEnvironment]) == 'object' ? environtments[currentEnvironment] : environtments.staging; //we are using an ifelse


//export the module 
module.exports = environmentToExport // we dont want to export entire envs as we can see from CODE LINE 7