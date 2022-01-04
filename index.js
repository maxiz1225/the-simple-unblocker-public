const {readFileSync} = require("fs")
const {join} = require("path")
const {createServer} = require("http")

const express = require("express")
const Corrosion = require("corrosion")
const blacklist = Corrosion.middleware.blacklist("accounts.google.com")

const app = express()
const corrosion = new Corrosion({
    codec: "xor",
    prefix: "/main/",
    title: "THE - SIMPLE - UNBLOCKER",
    requestMiddleware: [blacklist]
})

// Public files (index.html, index.css, etc.) in public folder
app.use(express.static(join(__dirname, "public")))

app.all("/main/*", (req, res) => {
    corrosion.request(req, res)
    if(req.headers.useragent === 'googlebot') return res.writeHead(403).end('');
})

// Assumes SSL cert and key are in the proxy's directory
const server = createServer({
    key: readFileSync(join(__dirname, "server.key")),
    cert: readFileSync(join(__dirname, "server.cert"))
}, app)

server.on("upgrade", (req, conn, head) => {
    corrosion.upgrade(req, conn, head)
})

let port = process.env.PORT || 80;

server.listen(port, () =>{
    console.log(`App is running at the port ${port}`);
});