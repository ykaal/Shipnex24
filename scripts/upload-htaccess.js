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

        console.log('📤 Uploading proxy .htaccess...');
        await sftp.put('.htaccess', `${projectDir}/.htaccess`);

        console.log('✅ .htaccess uploaded!');

        await sftp.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

deploy();
