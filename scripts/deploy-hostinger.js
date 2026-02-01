const { Client } = require('ssh2');
const fs = require('fs');

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const conn = new Client();
const projectDir = 'domains/login.shipnex24.com/public_html';

// Read local .env
const localEnv = fs.readFileSync('.env', 'utf8');

conn.on('ready', () => {
    console.log('✅ Connected. Uploading .env...');

    // Escape special characters for shell
    const escapedEnv = localEnv.replace(/'/g, "'\\''");

    conn.exec(`cat > ${projectDir}/.env << 'EOF'
${localEnv}
EOF`, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('✅ .env uploaded successfully.');

            // Kill existing node processes
            conn.exec('pkill -f "node server.js"', (err, s) => {
                s.on('close', () => {
                    console.log('Killed old processes.');

                    // Start node with full path
                    const nodePath = '/opt/alt/alt-nodejs20/root/usr/bin/node';
                    conn.exec(`cd ${projectDir} && nohup ${nodePath} server.js > server.log 2>&1 &`, (err, stream) => {
                        if (err) throw err;
                        stream.on('close', () => {
                            console.log('🚀 Node.js restarted with full .env!');
                            conn.end();
                        });
                    });
                });
            });
        });
    });
}).connect(config);
