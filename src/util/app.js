const fs = require('file-system')
const renderJson = (data = {}, status = true, code = 200, message = 'success') => {
    return {
        status,
        code,
        message,
        data
    }
}

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i <length; i ++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function storeFile (req, image) {
    if(image) {
        const generateFile = generateString(10)
        const fileName = generateFile + image.name
        const extension = fileName.split('.').pop()
        if (extension !== "jpeg" && extension !== "jpg" && extension !== "png"){
            throw Error("Image is invalid")
        }
        const filePath = "src/files/" + fileName
        fs.writeFileSync(filePath, image.data)
        return { fileName, filePath }
    }
}

module.exports = {
    renderJson,
    storeFile,
}
