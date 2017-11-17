// Imports.
const config = require('./config');
const redis = require('redis');
const http = require('http');
const range = require('range_check');
//const exec = require('ssh-exec');

// Launch Redis Client.
const resAddr = '//' + config.redis.host + ':' + config.redis.port + '/';
const client = redis.createClient(resAddr);

/* TODO: Launch fastnetmon daemon OVER SSH
const fastnetmon = {
    user: config.fastnetmon.user,
    host: config.fastnetmon.host,
    password: config.fastnetmon.password
};
let child = proc.spawn(fastnetmon.commande, fastnetmon.opts);
console.log('Fastnetmon Server Started [Ok]');

// Handle error and close events of Fastnetmon.
child.on('error', (err) => { console.error(err) } );
child.on('close', () => { child = proc.spawn(fastnetmon.commande, fastnetmon.opts); console.log('Fastnetmon Server Restarted [Ok]');});
*/

// Check if the networks in Config File are well configured or stop the program
config.fastnetmon.networks.forEach((network) => {
    if (!range.isRange(network)) {
        throw new Error("Config file: One network is not a range of IP");
    }
});
console.log('All networks defined are correct: [Ok]');

// Set HTTP options to send to Elastic


// Set up counters.
let restartCounter = 0;
let nbrCurrentHttpRequests = 0;

client.on('connect', () => {
    console.log('Connected on : ' + resAddr);
    setInterval(function () {

        // If no current HTTP transfer : check the database
        if (nbrCurrentHttpRequests == 0) {
            client.keys('fastnetmon_*_information', (err, keys) => {
                if (err)
                    console.error(err);
                nbrCurrentHttpRequests = keys.length;
                keys.forEach((key, index, object) =>
                    client.get(key, (err, reply) => {
                        if (err)
                            console.error(err);

                        // Put counter for restarting fastnetmon to O
                        restartCounter = 0;
                        
                        // Modify data from fastnetmon to Elastic data
                        let data = JSON.parse(reply);
                        let temp = data.attack_details;
                        temp.ip = data.ip;
                        temp.network = getNetwork(data.ip);
                        data = JSON.stringify(temp);

                        console.log(data);
                        process.exit(0);

                        // Set Content-Length
                        const options = {
                            host: config.elasticsearch.host,
                            port: config.elasticsearch.port,
                            path: config.elasticsearch.index
                            + '/' + config.elasticsearch.type,
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json; charset=UTF-8",
                                "Content-Length": Buffer.byteLength(data)
                            }
                        };

                        // Set request and handle answers
                        const req = http.request(options, (res) => {
                            res.on('error', (err) => {
                                console.error(err);
                                nbrCurrentHttpRequests--;
                            });
                            res.on('data', (chunk) => {
                                console.log('Elasticsearch saved : ' + key);
                                client.del(key);
                                nbrCurrentHttpRequests--;
                            });
                        });

                        // Send request
                        req.write(data);
                        req.end();

                    })
                );
            });
            restartCounter++;
        }

        /* TODO: If no new entry from Fastnetmon for 1000 secs kill it
        if (restartCounter >= config.fastnetmon.restartCounter) {
            child.kill('SIGINT');
            restartCounter = 0;
        }*/
    }, 1000);
});

/*
 * Fonction that says what networks contains the ip
 */
function getNetwork(ip) {
    config.fastnetmon.networks.forEach((network) => {
        if (range.inRange(ip, network))
            return network;
    });
}

/*
 * TODO: Ameliorate with a class 'Elastic'
 */