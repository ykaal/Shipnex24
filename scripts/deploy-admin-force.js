const SftpClient = require('ssh2-sftp-client');
const { Client } = require('ssh2');
const path = require('path');
const sftp = new SftpClient();
const conn = new Client();

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const projectDir = '/home/u544914549/domains/login.shipnex24.com/public_html';

async function deploy() {
    try {
        console.log('✅ SFTP Connecting...');
        await sftp.connect(config);

        console.log('📤 Uploading adminController.js...');
        const localFile = path.resolve(__dirname, '../src/controllers/adminController.js');
        const remoteFile = `${projectDir}/src/controllers/adminController.js`;
        await sftp.put(localFile, remoteFile);
        await sftp.end();

        console.log('✅ SSH Connecting for restart...');
        conn.on('ready', () => {
            // Kill existing node processes
            conn.exec('pkill -f "node server.js"', (err, stream) => {
                if (err) throw err;
                stream.on('close', () => {
                    console.log('💀 Killed old processes.');

                    // Start node with full path
                    const nodePath = '/opt/alt/alt-nodejs20/root/usr/bin/node';
                    conn.exec(`cd ${projectDir} && nohup ${nodePath} server.js > server.log 2>&1 &`, (err, stream) => {
                        if (err) throw err;
                        stream.on('close', () => {
                            console.log('🚀 Node.js restarted hard via SSH!');
                            conn.end();
                        });
                    });
                });
            });
        }).connect(config);

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

deploy();
