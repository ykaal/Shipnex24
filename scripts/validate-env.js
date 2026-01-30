const fs = require('fs');
const path = require('path');
require('dotenv').config();

const examplePath = path.join(__dirname, '../.env.example');
const exampleContent = fs.readFileSync(examplePath, 'utf8');

const regex = /^([A-Z0-9_]+)=/gm;
let match;
const requiredVars = [];

while ((match = regex.exec(exampleContent)) !== null) {
    requiredVars.push(match[1]);
}

console.log('🔍 Validating environment variables...');
const missing = [];
const empty = [];

requiredVars.forEach(v => {
    if (!(v in process.env)) {
        missing.push(v);
    } else if (!process.env[v] || process.env[v].includes('your-') || process.env[v].includes('sk_test_...')) {
        empty.push(v);
    }
});

if (missing.length > 0) {
    console.error('❌ Missing variables:', missing.join(', '));
}

if (empty.length > 0) {
    console.warn('⚠️ Placeholder or empty variables:', empty.join(', '));
}

if (missing.length === 0 && empty.length === 0) {
    console.log('✅ All environment variables are set correctly!');
} else if (missing.length === 0) {
    console.log('ℹ️ Environment looks okay, but some placeholders remain.');
} else {
    process.exit(1);
}
