const removeChars = [',',"'","!","&","?","/",'"',"(",")"]
function makeURLFriendly(text) {
    let output = text
    if (output !== undefined) {
        output = output.replaceAll(' ', '_')
        for (let i = 0; i < removeChars.length;i++) {
            output = output.replaceAll(removeChars[i],'')
        }
        output = output.toLowerCase()
    } else output = ''
    return output
}