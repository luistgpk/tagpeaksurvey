// Build script to inject environment variables
const fs = require('fs');
const path = require('path');

console.log('🔧 Building survey with environment variables...');

// Read the app-complete.js file
const appPath = path.join(__dirname, 'js', 'app-complete.js');
let content = fs.readFileSync(appPath, 'utf8');

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

console.log('📡 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...');

// Replace the placeholders with actual values
content = content.replace(
    "url: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',",
    `url: '${supabaseUrl}',`
);

content = content.replace(
    "anonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'",
    `anonKey: '${supabaseKey}'`
);

// Write the updated file
fs.writeFileSync(appPath, content);

console.log('✅ Environment variables injected successfully!');
console.log('🚀 Ready for deployment!');
