const supabase = require('../src/config/database');

async function testConnection() {
    console.log('🔌 Testing Supabase connection...');
    try {
        const { data, error } = await supabase
            .from('client_shops')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Database connection failed:', error.message);
            process.exit(1);
        } else {
            console.log('✅ Database connected successfully!');
            console.log(`📊 Current shops in database: ${data || 0}`);
            process.exit(0);
        }
    } catch (err) {
        console.error('💥 Unexpected error during connection test:', err.message);
        process.exit(1);
    }
}

testConnection();
