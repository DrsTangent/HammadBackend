function filePathToFileUrl(filePath){
    let fileUrl = filePath.split('\\public')[1];
    fileUrl = process.env.SERVER_URL+fileUrl.replaceAll('\\','/');
    return fileUrl;
}

function fileUrlToFilePath(fileUrl){
    let filePath = fileUrl.replace(process.env.SERVER_URL, `${__basedir}/public`)
    return filePath;
}

module.exports = {filePathToFileUrl, fileUrlToFilePath}