/**
 * 2014-06-21 23:45 UTC+8
 * Phoenix Nemo <i@phoenixlzx.com>
 * License MIT | http://opensource.org/licenses/MIT
 */

// read old hosts file and generate a clean sites-only list file.
// hosts file must be using tab character.

var fs = require('fs');

var sites = '';

fs.readFile('./hosts.list', 'utf8', function(err, data) {

    var lines = data.split('\n');

    lines.forEach(function(line) {
        // ignore empty lines and lines starts with '#'
        if (line !== '' && line.indexOf('#') !== 0) {
            // console.log(line.split('\t'));
			if (line.split('\t')[1]) {
				sites += line.split('\t')[1] + '\n';
			}
            
        }
    });

    fs.writeFile('./sites.list', sites, function(err) {
        if (err) throw err;
    });

});