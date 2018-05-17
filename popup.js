chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
}, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
	document.write ('<iframe id="url" frameBorder="2" scrolling="yes" height=40 width=250 src="http://tinyurl.com/api-create.php?url=' + url + '"/>');
});
