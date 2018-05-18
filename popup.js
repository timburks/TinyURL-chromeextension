chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
}, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    GetTinyURL(url, (correctURL)=>{
        document.getElementById("URLHere").innerHTML = correctURL;
    });
});

function GetTinyURL(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://tinyurl.com/api-create.php?url=' + url);
    xhr.onreadystatechange = function(){
        if(this.readyState===4)
            callback(this.responseText);
    }
    xhr.send();
}