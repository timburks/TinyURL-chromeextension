chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
}, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    // Default settings.
    var settings = {useHttps: false, autoCopy: false};

    // Checkboxes.
    var useHttpsEl = document.getElementById('tum-use-https');
    var autoCopyEl = document.getElementById('tum-copy-to-clipboard');

    // Update UI.
    updateUI();

    // Initial rendering.
    retrieveSettings(() => {
        updateUI();
        attachChangeHandlers();
        generateURL(url);
    });

    function getTinyURL(url, callback) {
        var xhr = new XMLHttpRequest();
        var prefix = !settings.useHttps ? 'http' : 'https';
        xhr.open(
            'GET',
            prefix + '://tinyurl.com/api-create.php?url=' + encodeURIComponent(url)
        );
        xhr.onreadystatechange = function() {
            if(this.readyState === 4) {
                var tinyurl = this.responseText;
                if(settings.useHttps) {
                    tinyurl = tinyurl.replace('http:', 'https:');
                }
                callback(tinyurl);
            }
        }
        xhr.send();
    }

    function generateURL(url) {
        getTinyURL(url, (tinyURL) => {
            var node = document.getElementById('tum-url');
            node.innerHTML = tinyURL;
            if(settings.autoCopy) {
                copyToClipboard(tinyURL);
            }
            selectText(node);
        });
    }

    function selectText(node) {
        if(document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    function copyToClipboard(text) {
        var el = document.createElement('input');
        el.type = 'text';
        el.value = text;
        el.style = {visibility: 'hidden', height: 0};
        document.body.appendChild(el);
        el.select();
        document.execCommand('Copy');
        document.body.removeChild(el);
    }

    function updateUI() {
        useHttpsEl.checked = settings.useHttps;
        autoCopyEl.checked = settings.autoCopy;
    }

    function attachChangeHandlers() {
        useHttpsEl.addEventListener('change', () => {
            settings.useHttps = useHttpsEl.checked;
            storeSettings();
            generateURL(url);
        }, false);

        autoCopyEl.addEventListener('change', () => {
            settings.autoCopy = autoCopyEl.checked;
            storeSettings();
        }, false);
    }

    function retrieveSettings(fn) {
        chrome.storage.sync.get(settings, (storedSettings) => {
            if(storedSettings) {
                settings.useHttps = !!storedSettings.useHttps;
                settings.autoCopy = !!storedSettings.autoCopy;
            }
            fn();
        });
    }

    function storeSettings() {
        chrome.storage.sync.set(settings);
    }
});
