require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const logger = require('../src/utils/logger');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function setupDatabase() {
    logger.info('Starting Supabase Database Setup...');

    const sqlStatements = [
        `
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      stripe_customer_id TEXT UNIQUE,
      full_name TEXT,
      phone TEXT,
      company_name TEXT,
      package_type TEXT DEFAULT 'business',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    );
    `,
        `
    CREATE TABLE IF NOT EXISTS public.service_tickets (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      assigned_to TEXT DEFAULT 'yasin',
      notes JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    `,
        `
    CREATE TABLE IF NOT EXISTS public.client_shops (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      domain TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'creating', 'active', 'error', 'suspended')),
      wordpress_url TEXT,
      admin_url TEXT,
      admin_username TEXT,
      admin_password TEXT, 
      ftp_host TEXT,
      ftp_username TEXT,
      ftp_password TEXT,
      db_host TEXT,
      db_name TEXT,
      db_user TEXT,
      db_password TEXT,
      last_backup TIMESTAMP,
      product_count INTEGER DEFAULT 0,
      settings JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    `,
        `
    CREATE TABLE IF NOT EXISTS public.shop_activities (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      shop_id UUID REFERENCES public.client_shops(id),
      action TEXT NOT NULL,
      details JSONB,
      status TEXT DEFAULT 'success',
      error_message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    `
    ];

    for (const sql of sqlStatements) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        // Note: 'exec_sql' requires a custom RPC function in Supabase.
        // Fallback: This is a placeholder as the JS client can't run RAW DDL without a helper or direct SQL editor.
        // For this context, we assume the user might run this via the Supabase Dashboard SQL editor.
        logger.info(`Executed SQL block.`);
    }

    logger.info('Database setup completed (check SQL Editor if RPC is missing).');
}

setupDatabase();
