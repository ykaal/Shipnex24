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
    console.log('✅ Connected');

    // Reset and pull
    const commands = [
        `cd ${projectDir} && git reset --hard`,
        `cd ${projectDir} && git clean -fd`,
        `cd ${projectDir} && git pull origin main`,
        `cd ${projectDir} && chmod +x server.js`,
        `pkill -9 -f "node server.js"`,
        `cd ${projectDir} && nohup /opt/alt/alt-nodejs20/root/usr/bin/node server.js > server.log 2>&1 &`,
        `sleep 2`,
        `cd ${projectDir} && tail -30 server.log`
    ];

    let index = 0;

    function runNext() {
        if (index >= commands.length) {
            console.log('\n✅ DEPLOYMENT COMPLETE!');
            conn.end();
            return;
        }

        const cmd = commands[index++];
        console.log(`\n🔧 Running: ${cmd.split('&&').pop().trim()}`);

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error('Error:', err);
                conn.end();
                return;
            }

            stream.on('data', (d) => console.log(d.toString()));
            stream.stderr.on('data', (d) => console.log('STDERR:', d.toString()));
            stream.on('close', () => runNext());
        });
    }

    runNext();
}).connect(config);
