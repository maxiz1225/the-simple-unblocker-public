import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import Proxy from './lib/main/bundle.js';
import Server from 'bare-server-node';
import nodeStatic from 'node-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Assumes SSL cert and key are in the proxy's directory
const server = createServer({
    key: readFileSync(join(__dirname, "server.key")),
    cert: readFileSync(join(__dirname, "server.cert"))
});

const rhodium = new Proxy({
    encode: 'xor',
    title: "THE - SIMPLE - UNLBOCKER",
    server: server, 
    wss: true, 
    corrosion: [false, {}], 
    favicon: 'https://google.com/favicon.ico',
    prefix: '/rhodium/'
});

rhodium.init();

const bare = new Server('/bare/', '');
const serve = new nodeStatic.Server('public/');
// Public files (index.html, index.css, etc.) in public folder
server.on('request', (req, res) => {
    if (req.url.startsWith(rhodium.prefix)) {
        rhodium.request(req, res);
    } else {
        if (bare.route_request(req, res)) return true;
        serve.serve(req, res);
    }
})

server.on("upgrade", (req, socket, head) => {
    if (bare.route_upgrade(req, socket, head)) return;
    socket.end();
})
//how to enable SSL change the PORT to 443 or your prefered port and change the  { createServer } from 'http' to https
let port = process.env.PORT || 80;
server.listen(port, () =>{
    console.log(`App is running at the port ${port}`);
});
