const supabase = require('../src/config/database');

async function fixUserAndShop() {
    const email = 'admin@shipnex24.com';
    const domain = 'demo.shipnex24.com';

    console.log(`🔍 Suche User ${email}...`);

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('❌ Fehler beim Listen der User:', listError.message);
        return;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        console.error('❌ User nicht gefunden. Bitte erstelle ihn mit init_user.js');
        return;
    }

    console.log(`✅ User gefunden: ${user.id}`);

    // Update existing or insert new shop with correct 'domain' field
    const { data: existingShops } = await supabase.from('client_shops').select('*').eq('user_id', user.id);

    if (existingShops && existingShops.length > 0) {
        console.log('ℹ️ Aktualisiere bestehenden Shop...');
        await supabase.from('client_shops').update({ domain }).eq('user_id', user.id);
    } else {
        console.log('ℹ️ Erstelle neuen Test-Shop...');
        await supabase.from('client_shops').insert({
            user_id: user.id,
            domain,
            status: 'active'
        });
    }

    console.log('🚀 FERTIG. Bitte das Dashboard jetzt aktualisieren.');
}

fixUserAndShop();
