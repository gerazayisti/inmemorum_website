const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createBucket() {
  console.log("Checking bucket: galerie-memorial...");
  const { data, error } = await supabaseAdmin.storage.createBucket('galerie-memorial', {
    public: false, // On garde privé car on utilise des URLs signées
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log("Bucket already exists.");
    } else {
      console.error("Error creating bucket:", error.message);
    }
  } else {
    console.log("Bucket 'galerie-memorial' created successfully!");
  }
}

createBucket();
