const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            const symbol = String(req.query.symbol).trim().toUpperCase();
            if (!/^[A-Z0-9.\-]{1,10}$/.test(symbol)) {
                return res.status(400).send("Invalid symbol");
            }

            const stockApiBaseUrl = "https://stooq.com/q/l/";
            const requestUrl = new URL(stockApiBaseUrl);
            requestUrl.searchParams.set("s", symbol);
            requestUrl.searchParams.set("f", "sd2t2ohlcvn");
            requestUrl.searchParams.set("h", "");
            requestUrl.searchParams.set("e", "json");

            return needle.get(requestUrl.toString(), (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
        }

        return res.render("research", {
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;
