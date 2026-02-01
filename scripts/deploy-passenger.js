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

        console.log('📤 Uploading app.js...');
        await sftp.put('app.js', `${projectDir}/app.js`);

        console.log('📤 Uploading updated server.js...');
        await sftp.put('server.js', `${projectDir}/server.js`);

        console.log('📤 Uploading Passenger .htaccess...');
        await sftp.put('.htaccess', `${projectDir}/.htaccess`);

        console.log('✅ All files uploaded!');
        console.log('🔄 Triggering Passenger restart...');

        // Create tmp/restart.txt to trigger Passenger restart
        await sftp.mkdir(`${projectDir}/tmp`, true);
        await sftp.put(Buffer.from('restart'), `${projectDir}/tmp/restart.txt`);

        console.log('🚀 Deployment complete! Passenger should restart automatically.');

        await sftp.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

deploy();
