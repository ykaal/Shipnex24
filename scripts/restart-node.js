const { Client } = require('ssh2');

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const conn = new Client();
const projectDir = 'domains/login.shipnex24.com/public_html';
const nodePath = '/opt/alt/alt-nodejs20/root/usr/bin/node';

conn.on('ready', () => {
    console.log('✅ Connected');

    // Kill all node processes
    conn.exec('pkill -9 -f "node server.js"', (err, stream) => {
        stream.on('close', () => {
            console.log('🔪 Killed old processes');

            // Wait a moment
            setTimeout(() => {
                // Start fresh
                conn.exec(`cd ${projectDir} && nohup ${nodePath} server.js > server.log 2>&1 &`, (err, stream) => {
                    if (err) throw err;
                    stream.on('close', () => {
                        console.log('🚀 Node.js started!');

                        // Wait and check log
                        setTimeout(() => {
                            conn.exec(`tail -20 ${projectDir}/server.log`, (err, stream) => {
                                stream.on('data', (d) => console.log('LOG:\n' + d));
                                stream.on('close', () => conn.end());
                            });
                        }, 2000);
                    });
                });
            }, 1000);
        });
    });
}).connect(config);
