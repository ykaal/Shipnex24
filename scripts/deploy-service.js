const SftpClient = require('ssh2-sftp-client');
const path = require('path');
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
        console.log('✅ Connecting...');
        await sftp.connect(config);

        console.log('📤 Uploading hostingerService.js...');
        const localFile = path.resolve(__dirname, '../src/services/hostingerService.js');
        const remoteFile = `${projectDir}/src/services/hostingerService.js`;

        // Ensure directory exists
        await sftp.mkdir(`${projectDir}/src/services`, true);
        await sftp.put(localFile, remoteFile);

        console.log('🔄 Triggering Restart...');
        await sftp.mkdir(`${projectDir}/tmp`, true);
        await sftp.put(Buffer.from('restart'), `${projectDir}/tmp/restart.txt`);

        console.log('🚀 Done!');
        await sftp.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

deploy();
