const supabase = require('../src/config/database');

async function initializeUser() {
    const email = 'admin@shipnex24.com';
    const password = 'ChangeMe123!'; // User should change this
    const shopName = 'Mein Test Shop';

    console.log(`🚀 Initialisierung für ${email} gestartet...`);

    // 1. Create User in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log('ℹ️ Benutzer existiert bereits.');
        } else {
            console.error('❌ Fehler beim Erstellen des Benutzers:', authError.message);
            return;
        }
    } else {
        console.log('✅ Benutzer erfolgreich erstellt.');
    }

    // Get User ID (either from create or find existing)
    const userId = authData?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id;

    if (!userId) {
        console.error('❌ Konnte User ID nicht finden.');
        return;
    }

    // 2. Create User Profile entry (if needed by your schema)
    // Assuming client_shops is the main table to link
    const { error: shopError } = await supabase
        .from('client_shops')
        .insert([
            {
                user_id: userId,
                shop_name: shopName,
                status: 'active',
                wp_url: 'https://shipnex24.com',
                stripe_customer_id: 'cus_test_123'
            }
        ]);

    if (shopError) {
        console.error('❌ Fehler beim Erstellen des Test-Shops:', shopError.message);
    } else {
        console.log(`✅ Test-Shop "${shopName}" für User angelegt.`);
    }

    console.log('\n--- FERTIG ---');
    console.log(`Email: ${email}`);
    console.log(`Passwort: ${password}`);
    console.log('Bitte logge dich jetzt unter https://login.shipnex24.com ein.');
}

initializeUser();
