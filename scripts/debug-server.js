const { Client } = require('ssh2');

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const conn = new Client();
const projectDir = 'domains/login.shipnex24.com/public_html';

conn.on('ready', () => {
    // Check if Node.js is running
    conn.exec('ps aux | grep "node server.js" | grep -v grep', (err, stream) => {
        stream.on('data', (d) => console.log('PROCESS:', d.toString()));
        stream.on('close', () => {
            // Check server log
            conn.exec(`tail -100 ${projectDir}/server.log`, (err, stream) => {
                stream.on('data', (d) => console.log('LOG:\n' + d.toString()));
                stream.on('close', () => {
                    // Test localhost:3000 from server
                    conn.exec('curl -s http://localhost:3000/api/health', (err, stream) => {
                        stream.on('data', (d) => console.log('\nLOCALHOST TEST:', d.toString()));
                        stream.on('close', () => conn.end());
                    });
                });
            });
        });
    });
}).connect(config);
