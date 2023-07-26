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

function redirectToHttps() {
    if (window.location.href.search('sharkside.ca') !== -1) {
        if (window.location.href.search('https') === -1) {
            let newURL = window.location.href.replace('http','https')
            location.replace(newURL)
        }
    }
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

let $scrollBar = undefined
let $scrollFill = undefined
let currentHeight = undefined
let currentYPos = undefined
function scrollBar() {
    let body = document.body, html = document.documentElement;
    let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    if (currentHeight != height) currentHeight = height
    else if (currentYPos != window.scrollY) currentYPos = window.scrollY
    else return
        
    if ($scrollBar == undefined) $scrollBar = document.getElementsByClassName('scrollBar')[0]
    if ($scrollFill == undefined) $scrollFill = document.getElementsByClassName('scrollFill')[0]

    if ($scrollBar !== undefined) {
        let heightOffset = window.innerHeight
        let yPos = window.scrollY
        let removeHeight = (heightOffset / height) * 100
        $scrollFill.style.height = removeHeight + "%"
        $scrollFill.style.top = (yPos / (height - heightOffset)) * (100 - removeHeight) + "%"
    }
}


document.addEventListener('scroll', scrollBar)
setInterval(scrollBar, 100)