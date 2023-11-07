
var search = location.hash.replace('#','');

var _push = url=>{
    history.pushState(null,null,url);
    loadUrl(document.location.href);
}

window.onpopstate = e => loadUrl(document.location.href);

const loadUrl = url => url === location.origin + location.pathname ? loadReport() : redirection();

const openEntry = search !== "" ? _push(document.location.href):''

loadUrl(document.location.href);




