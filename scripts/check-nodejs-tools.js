const { Client } = require('ssh2');

const config = {
    host: '46.202.142.49',
    port: 65002,
    username: 'u544914549',
    password: 'YXCasdqwe123123123!'
};

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ Connected');

    // Check for CloudLinux selector
    conn.exec('which cloudlinux-selector', (err, stream) => {
        let output = '';
        stream.on('data', (d) => output += d);
        stream.on('close', () => {
            if (output.trim()) {
                console.log('✅ CloudLinux Selector found:', output.trim());

                // Try to list Node.js apps
                conn.exec('cloudlinux-selector list --json --interpreter nodejs', (err, stream) => {
                    stream.on('data', (d) => console.log('APPS:', d.toString()));
                    stream.on('close', () => conn.end());
                });
            } else {
                console.log('❌ CloudLinux Selector not found');

                // Check for alternative: cPanel's Node.js manager
                conn.exec('ls -la /usr/local/cpanel/scripts/ | grep node', (err, stream) => {
                    stream.on('data', (d) => console.log('CPANEL SCRIPTS:', d.toString()));
                    stream.on('close', () => {
                        // Check for Passenger standalone
                        conn.exec('which passenger', (err, stream) => {
                            let pass = '';
                            stream.on('data', (d) => pass += d);
                            stream.on('close', () => {
                                if (pass.trim()) {
                                    console.log('✅ Passenger found:', pass.trim());
                                } else {
                                    console.log('❌ No Node.js management tools found');
                                }
                                conn.end();
                            });
                        });
                    });
                });
            }
        });
    });
}).connect(config);
