var HawkClient = (function () {

    function generateHawkHeader(method, uri, host, port, credentials) {
        var ts = Math.floor(new Date().getTime() / 1000).toString();
        var nonce = Math.random().toString(36).substring(2, 8);

        var normalized = "hawk.1.header\n" +
            ts + "\n" +
            nonce + "\n" +
            method.toUpperCase() + "\n" +
            uri + "\n" +
            host.toLowerCase() + "\n" +
            port + "\n" +
            "\n" +
            "\n";

        //log("Normalized string for Hawk MAC:\n" + normalized);

        var macRaw = Crypto.hmac("SHA256", credentials.key)
            .update(normalized)
            .final(true);

        var mac = Encoding.binToBase64(macRaw);

        //log("Calculated MAC: " + mac);

        return 'Hawk id="' + credentials.id + '", ts="' + ts + '", nonce="' + nonce + '", mac="' + mac + '"';
    }

    function parseUrl(url) {
        var m = url.match(/(https?):\/\/([^\/:]+)(?::(\d+))?(\/[^?]*)?(?:\?(.*))?/);
        return {
            scheme: m[1],
            host: m[2],
            port: m[3] ? parseInt(m[3], 10) : (m[1] === "https" ? 443 : 80),
            path: m[4] || "/",
            query: m[5] || ""
        };
    }

    function sendHawkRequest(method, url, credentials, callback) {
        var parts = parseUrl(url);
        var path = parts.path + (parts.query ? "?" + parts.query : "");

        var req = HttpClient.request(method.toUpperCase(), url);
        req.header("Accept", "application/json");
        req.header("User-Agent", "hawk-client-lib/1.0");

        var hawkHeader = generateHawkHeader(method, path, parts.host, parts.port, credentials);
        req.header("Authorization", hawkHeader);

        var text = "";
        req.onrecv(function (req, data, last) {
            text += new TextDecoder("utf-8").decode(data);
            if (!last) req.recv();
        });

        req.oncomplete(function (req, success) {
            callback(success ? 200 : req.status, text);
        });

        req.recv();
    }

    return {
        request: sendHawkRequest
    };
})();
