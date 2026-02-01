const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function forceInitAdmin() {
    console.log('🚀 Force-Initializing Admin Profile...');

    // 1. Get Admin User
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('❌ Error listing users:', listError);
        return;
    }

    const adminUser = users.find(u => u.email === 'admin@shipnex24.com');

    if (!adminUser) {
        console.error('❌ Admin user admin@shipnex24.com not found in auth.users.');
        return;
    }

    console.log(`✅ Found Admin UUID: ${adminUser.id}`);

    // 2. Upsert Profile
    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
            id: adminUser.id,
            role: 'admin',
            full_name: 'System Admin',
            package_type: 'business',
            status: 'active'
        });

    if (upsertError) {
        console.error('❌ Error upserting admin profile:', upsertError);
    } else {
        console.log('🎉 Admin Profile successfully created/updated!');
    }
}

forceInitAdmin();
