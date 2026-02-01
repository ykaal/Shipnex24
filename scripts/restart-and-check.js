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
    console.log('🔄 Restarting Node.js...');
    conn.exec(`pkill -9 -f "node server.js"; cd ${projectDir} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node server.js > server.log 2>&1 &`, (err, stream) => {
        stream.on('close', () => {
            setTimeout(() => {
                conn.exec(`tail -50 ${projectDir}/server.log`, (err, stream) => {
                    stream.on('data', (d) => console.log('LOG:\n' + d));
                    stream.on('close', () => conn.end());
                });
            }, 3000);
        });
    });
}).connect(config);
