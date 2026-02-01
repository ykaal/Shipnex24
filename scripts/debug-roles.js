const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkRoles() {
    console.log('--- Supabase Role Check ---');
    const { data: profiles, error } = await supabase.from('profiles').select('*');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    if (profiles && profiles.length > 0) {
        console.log('Profiles found:', profiles.length);
        profiles.forEach(p => {
            console.log(`User: ${p.id}, Name: ${p.full_name}, Role: ${p.role}`);
        });
    } else {
        console.log('No profiles found in public.profiles table.');
    }
}

checkRoles();
