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

function cleanURL() {
    let stateObj = { id: "100" };
    let url = window.location.href

    let query = url.split('?')[1]
    let baseUrl = url.split('?')[0].split('.html').join('').split('/index')[0]
    let newUrl = baseUrl
    console.log(newUrl)
    if (url.search('sharkside.ca') === -1) return

    if (query) baseUrl += "?" + query
    window.history.replaceState(stateObj,
        "Search", newUrl);
}