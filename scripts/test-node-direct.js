const { Client } = require('ssh2');

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const conn = new Client();

conn.on('ready', () => {
    // Test Node.js directly
    conn.exec('curl -v http://127.0.0.1:3000/api/health 2>&1', (err, stream) => {
        stream.on('data', (d) => console.log(d.toString()));
        stream.on('close', () => conn.end());
    });
}).connect(config);
