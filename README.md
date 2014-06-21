Hosts-Generator
===============

This is a tool for generating a hosts file through a clean DNS server, using Node.js.

### Usage

1. Move `config.js.example` to `config.js` and edit for your needs.
2. `node generator.js`

If you need to generate a pure sites list from current hosts file, give `test/generate-site-list.js` a try.

Please note the hosts file should split address and domain with `TAB` character.