/**
 * 2014-06-22 00:00 UTC+8
 * Phoenix Nemo <i@phoenixlzx.com>
 * License MIT | http://opensource.org/licenses/MIT
 */

var fs = require('fs');
var dns = require('native-dns');
var async = require('async');

var config = require('./config');

var hosts = '';

// read siteslist from config
fs.readFile(config.sitelistpath, 'utf8', function(err, data) {

    var sites = data.split('\n');

    async.eachSeries(sites, function(site, callback) {

        if (site === '') {
            // skip empty lines
            return callback();
        }

        setTimeout(function() {

            var question = dns.Question({
                name: site,
                type: 'A'
            });

            var req = dns.Request({
                question: question,
                server: { address: config.server, port: config.port, type: 'udp' },
                timeout: 1000
            });

            var badips = badip(config.badipslist);

            req.on('timeout', function () {
                console.log('Timeout in making request for ' + site);
                // callback();
            });

            req.on('message', function (err, answer) {
                answer.answer.forEach(function (addr) {
                    // console.log(addr.address);
                    if (badips.indexOf(addr)) {
                        console.log('Skipped bad IP: ' + addr);
                    } else {
                        hosts += addr.address + '\t' + site + '\n';
                    }
                });
            });

            req.on('end', function () {
                console.log('Finished processing ' + site);
                callback();
            });

            req.send();

        }, config.wait);
    }, function() {

        // write hosts to file
        fs.writeFile(config.output, hosts, function(err) {
            if (err) throw err;
            console.log('Finished generating hosts file.');
        });

    });

});

function badip(listfile) {

    fs.readFile(listfile, 'utf8', function(err, list) {
        if (err) throw err;
        var data = list.split('\n');
        var ips = [];
        data.forEach(function(ip) {
            if (ip && ip.indexOf('#') === -1) {
                ips.push(ip);
            }
        });
        return ips;
    });

}