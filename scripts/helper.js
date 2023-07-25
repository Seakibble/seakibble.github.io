const removeChars = ['- ',',',"'","!","&","?","/",'"',"(",")"]
function makeURLFriendly(text) {
    let output = text
    if (output !== undefined) {
        for (let i = 0; i < removeChars.length; i++) {
            output = output.replaceAll(removeChars[i], '')
        }
        output = output.replaceAll(' ', '_')
        
        output = output.toLowerCase()
    } else output = ''
    return output
}

function cleanURL() {
    // let stateObj = { id: "100" };
    // let url = window.location.href

    // let query = url.split('?')[1]
    // let baseUrl = url.split('?')[0].split('.html').join('').split('/index')[0]
    // let newUrl = baseUrl
    // console.log(newUrl)
    // if (url.search('sharkside.ca') === -1) return

    // if (query) baseUrl += "?" + query
    // window.history.replaceState(stateObj,
    //     "Search", newUrl);
}

function cleanLinks() {
    if (window.location.href.search('sharkside.ca') !== -1) {
        // live site
        let links = document.getElementsByTagName('a')
        for (let i = 0; i < links.length; i++) {
            if (links[i].href.search('.html') !== -1) {                
                links[i].href = links[i].href.replace('.html','')
            }

            if (links[i].href.search('/index') !== -1) {
                links[i].href = links[i].href.replace('/index', '')
            }
        }
    }
}