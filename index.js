'use strict';

var ip = require('ip');

var parser = function (data) {
    var ifs = {};

    var name;

    data.split('\n').forEach(function (line) {
        var bitmask;
        var l1 = line.match(/(\d+): (\S+): .+ mtu (\d+) .+ state (\S+)/i);

        if (l1 && l1[1] && l1[2] && l1[3] && l1[4]) {
            name = l1[2];

            if (!ifs.hasOwnProperty(name)) {
                ifs[name] = {
                    address: []
                };
            }

            ifs[name].index = parseInt(l1[1], 10);
            ifs[name].state = l1[4];
            ifs[name].mtu = parseInt(l1[3], 10);
        }

        var l2 = line.match(/(([0-9A-F]{2}[:-]){5}([0-9A-F]{2}))/i);

        if (l2 && l2[1]) {
            ifs[name].mac = l2[1];
        }

        var l3 = line.match(/(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)\/(\d+)/);

        if (l3 && l3[1]) {
            bitmask = parseInt(l3[2], 10);

            ifs[name].address.push({
                ip: l3[1],
                bitmask: bitmask,
                mask: ip.fromPrefixLen(bitmask),
                family: 'ipv4'
            });
        }

        var l4 = line.match(/inet6 (\S+)\/(\d+)/);

        if (l4 && l4[1] && l4[2]) {
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
