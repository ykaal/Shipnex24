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
    console.log('✅ Connected to Hostinger');

    // Check if git is available
    conn.exec('which git', (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('data', (d) => output += d);
        stream.on('close', () => {
            if (output.trim()) {
                console.log('✅ Git found at:', output.trim());

                // Check current git status
                conn.exec(`cd ${projectDir} && git status`, (err, stream) => {
                    if (err) throw err;
                    stream.on('data', (d) => console.log('GIT STATUS:', d.toString()));
                    stream.stderr.on('data', (d) => console.log('GIT ERROR:', d.toString()));
                    stream.on('close', () => {
                        // Pull latest changes
                        console.log('\n🔄 Pulling latest changes from GitHub...');
                        conn.exec(`cd ${projectDir} && git pull origin main`, (err, stream) => {
                            if (err) throw err;
                            stream.on('data', (d) => console.log('PULL:', d.toString()));
                            stream.stderr.on('data', (d) => console.log('PULL ERROR:', d.toString()));
                            stream.on('close', () => {
                                console.log('✅ Git pull complete!');

                                // Restart the app
                                console.log('🔄 Restarting Node.js...');
                                const nodePath = '/opt/alt/alt-nodejs20/root/usr/bin/node';
                                conn.exec(`pkill -9 -f "node server.js"; cd ${projectDir} && nohup ${nodePath} server.js > server.log 2>&1 &`, (err, stream) => {
                                    stream.on('close', () => {
                                        console.log('🚀 Deployment complete!');
                                        conn.end();
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                console.log('❌ Git not found on server');
                conn.end();
            }
        });
    });
}).connect(config);
