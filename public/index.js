const input = document.getElementById('input');
const submit = document.getElementById('submit');

const uv = document.getElementById('ultraviolet');
const rhodium = document.getElementById('rhodium');

window.addEventListener('load', () => {
    const currentproxy = localStorage.getItem('proxy');

    if (currentproxy !== null) {
        document.getElementById(currentproxy).classList.add('selected');
    }
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let url = input.value.trim();
        if (!isUrlVal()) {
            getProxy();
        } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
            url = 'http://' + url;
            getProxy();
        }
    }
});

function getProxy(url = input.value) {
    if (localStorage.getItem('proxy') === 'rhodium') {
        window.location.href = `/rhodium/gateway?url=${url}`;
    } else if (localStorage.getItem('proxy') === 'ultraviolet') {
        window.navigator.serviceWorker.register('./sw.js', {
            scope: __uv$config.prefix
        }).then(() => {
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        })
    }
};
function setProxy(proxy) {
    localStorage.setItem('proxy', proxy)
    if (proxy == 'rhodium') {
        rhodium.classList.add('selected')
        uv.classList.remove('selected')
    } else if (proxy == 'ultraviolet') {
        rhodium.classList.remove('selected')
        uv.classList.add('selected')
    }
};
function isUrlVal(url = input.value) {
    return url.match(/^(https?:\/\/)?((([a-z\d-]+\.)*[a-z\d-]+\.[a-z]{2,}(:\d{1,5})?(\/\S*)?)|([\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}(:\d{1,5})?(\/\S*)?))$/);
};