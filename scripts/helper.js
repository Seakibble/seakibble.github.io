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

// let $scrollBar = undefined
// let $scrollFill = undefined
// let currentHeight = undefined
// let currentYPos = undefined
// let $scrollBars = document.getElementsByClassName('scrollBar')

// function scrollBarEvent(e) {
//     for (let i = 0; i < $scrollBars.length; i++) {
//         scrollBarUpdate($scrollBars[i])
//     }
// }

// function scrollBar() {
//     if ($scrollBar == undefined) $scrollBar = document.getElementsByClassName('scrollBar')[0]
//     if ($scrollFill == undefined) $scrollFill = document.getElementsByClassName('scrollFill')[0]

//     for (let i = 0; i < $scrollBars.length; i++) {
//         // scrollBarUpdate($scrollBars[i])
//     }
// }

// function scrollBarUpdate(scrollBar) {
    
//     let parent = scrollBar.parentElement
//     console.log(parent)
//     let body = document.body, html = document.documentElement;
//     if (parent == body) parent = html
//     let scrollPosition = parent.scrollTop
//     console.log(scrollPosition)

//     let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
//     if (currentHeight != height) currentHeight = height
//     else if (currentYPos != window.scrollY) currentYPos = window.scrollY
//     else return
    

//     if ($scrollBar !== undefined) {
//         let heightOffset = window.innerHeight
//         let yPos = window.scrollY

//         let barHeight = (heightOffset / height) * 100
//         $scrollFill.style.height = barHeight + "%"
//         let barOffset = (yPos / (height - heightOffset)) * (100 - barHeight)
//         $scrollFill.style.top = barOffset + "%"

//         if (barOffset == 0) {
//             $scrollFill.classList.add('top')
//         } else if (barOffset + barHeight == 100) {
//             $scrollFill.classList.add('bottom')
//             $scrollFill.classList.remove('top')
//         } else {
//             $scrollFill.classList.remove('top')
//             $scrollFill.classList.remove('bottom')
//         }
//     }
// }


// document.addEventListener('scroll', scrollBarEvent)
// setInterval(scrollBar, 100)