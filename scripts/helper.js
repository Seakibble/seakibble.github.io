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

Vector = function (_x = 0, _y = 0) {
    return {
        x: _x,
        y: _y,
        Add: function (_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
        },
        Subtract: function (_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
        },
        Diff: function (_vec) {
            return Vector(this.x - _vec.x, this.y - _vec.y);
        },
        Set: function (_x, _y) {
            this.x = _x;
            this.y = _y;
        },
        Mult: function (_n) {
            this.x *= _n;
            this.y *= _n;
        },
        Magnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        },
        Dist: function (_vec) {
            var diff = this.Diff(_vec);
            return diff.Magnitude()
        },
        Normalize: function (_n) {
            var d = this.Dist(Vector(0, 0));
            return this.Mult(_n / d);
        },
        Report: function () {
            console.log(this.x + ", " + this.y);
        }
    }
};