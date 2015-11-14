'use strict';

var ip = require('ip');

var parser = function (data) {
    var ifs = {};

    var name;

    data.split('\n').forEach(function (line) {
        var bitmask;
        var l1 = line.match(/(\d+): (\S+): .+ mtu (\d+)/i);

        if (l1 && l1[1] && l1[2] && l1[3]) {
            name = l1[2];

            if (!ifs.hasOwnProperty(name)) {
                ifs[name] = {
                    address: []
                };
            }

            ifs[name].index = parseInt(l1[1], 10);
            ifs[name].mtu = parseInt(l1[3], 10);

            var l1s = line.match(/state (\S+)/);

            if (l1s && l1s[1]) {
                ifs[name].state = l1s[1];
            }
        }

        var l2 = line.match(/(([0-9A-F]{2}[:-]){5}([0-9A-F]{2}))/i);

        if (name && l2 && l2[1]) {
            ifs[name].mac = l2[1];
        }

        var l3 = line.match(/(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)\/(\d+)/);

        if (name && l3 && l3[1]) {
            bitmask = parseInt(l3[2], 10);

            var address = {
                ip: l3[1],
                bitmask: bitmask,
                mask: ip.fromPrefixLen(bitmask),
                family: 'ipv4'
            };

            var l3b = line.match(/brd (\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)/i);

            if (l3b && l3b[1]) {
                address.broadcast = l3b[1];
            }

            ifs[name].address.push(address);
        }

        var l4 = line.match(/inet6 (\S+)\/(\d+)/);

        if (name && l4 && l4[1] && l4[2]) {
            bitmask = parseInt(l4[2], 10);

            ifs[name].address.push({
                ip: l4[1],
                bitmask: bitmask,
                mask: ip.fromPrefixLen(bitmask),
                family: 'ipv6'
            });
        }
    });

    return ifs;
};

module.exports = parser;
