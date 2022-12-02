const zlib = require("zlib");

function Decompress(ctx) {
    return (res, data) => {
        switch (res.headers["content-encoding"]) {
            case "gzip":
                return zlib.gunzipSync(Buffer.concat(data));
            case "deflate":
                return zlib.inflateSync(Buffer.concat(data));
            case "br":
                zlib.brotliDecompressSync(Buffer.concat(data));
            default:
                Buffer.concat(data);
        }
    }
}

module.exports = Decompress;
