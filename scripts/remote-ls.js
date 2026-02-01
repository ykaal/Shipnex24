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
    // Check for Passenger configuration
    conn.exec(`ls -la ${projectDir}/ | grep -E "\.htaccess|passenger|app\\.js"`, (err, stream) => {
        stream.on('data', (d) => console.log('FILES: ' + d));
        stream.on('close', () => {
            // Check if there's a startup file or config
            conn.exec(`cat ${projectDir}/.htaccess 2>/dev/null || echo "No .htaccess"`, (err, stream) => {
                stream.on('data', (d) => console.log('HTACCESS:\n' + d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).connect(config);
