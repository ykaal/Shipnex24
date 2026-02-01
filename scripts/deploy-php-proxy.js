const SftpClient = require('ssh2-sftp-client');

const sftp = new SftpClient();

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const projectDir = '/home/u544914549/domains/login.shipnex24.com/public_html';

async function deploy() {
    try {
        console.log('✅ Connecting via SFTP...');
        await sftp.connect(config);

        console.log('📤 Uploading PHP proxy...');
        await sftp.put('api-proxy.php', `${projectDir}/api-proxy.php`);

        console.log('📤 Uploading updated .htaccess...');
        await sftp.put('.htaccess', `${projectDir}/.htaccess`);

        console.log('✅ PHP proxy deployed!');
        console.log('🔄 Restarting Node.js...');

        await sftp.end();

        // Restart Node.js via SSH
        const { Client } = require('ssh2');
        const conn = new Client();

        conn.on('ready', () => {
            conn.exec(`pkill -9 -f "node server.js"; cd ${projectDir} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node server.js > server.log 2>&1 &`, (err, stream) => {
                stream.on('close', () => {
                    console.log('🚀 Deployment complete!');
                    conn.end();
                });
            });
        }).connect(config);

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

deploy();
