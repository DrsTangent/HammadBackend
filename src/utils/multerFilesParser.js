const createHttpError = require("http-errors");
const { filePathToFileUrl } = require("./fileHandling");

async function getSingleFileUrlRequired(key, filesObj){
    if(!filesObj[key])
        throw new createHttpError.BadRequest(`${key} field is missing`);
    let fileUrl = filePathToFileUrl(filesObj[key][0].path);
    return fileUrl;
}

async function getSingleFileUrl(key, filesObj){
    try{
        let fileUrl = filePathToFileUrl(filesObj[key][0].path);
        return fileUrl
    }
    catch(error)
    {
        return undefined
    }
}

async function getMultipleFilesUrls(key, filesObj){
    try{
        let filesUrls = []
        for(let i = 0; i<filesObj[key].length; i++){
            filesUrls.push(filePathToFileUrl(filesObj[key][i].path))
        }
        return filesUrls; 
    }
    catch(error)
    {
        return []
    }
}

module.exports = {getSingleFileUrlRequired, getSingleFileUrl, getMultipleFilesUrls};