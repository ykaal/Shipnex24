const supabase = require('./src/config/database');
async function check() {
    const { data, error } = await supabase.from('client_shops').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    } else {
        console.log('Connection successful! Shops count:', data);
        process.exit(0);
    }
}
check();
