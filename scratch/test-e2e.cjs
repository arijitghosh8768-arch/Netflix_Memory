const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ruxinzqymhlypxivyjbp.supabase.co', 'sb_publishable_5N4xWqmUoUphXKT881A25g_g1kLwqyO');

async function test() {
  console.log('Testing Auth...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@ourstory.local',
    password: 'password123'
  });
  
  if (authError) {
    console.error('Auth failed:', authError.message);
    return;
  }
  console.log('Auth SUCCESS. User ID:', authData.user.id);
  
  console.log('Testing CRUD...');
  const { data: insertData, error: insertError } = await supabase.from('couples').insert({
    slug: 'test-couple-1',
    person1_name: 'Test 1',
    person2_name: 'Test 2',
    relationship_start: '2020-01-01',
    status: 'DRAFT'
  }).select();
  
  if (insertError) {
    console.error('CRUD Insert failed:', insertError.message);
    return;
  }
  console.log('CRUD Insert SUCCESS:', insertData[0].slug);
  
  const coupleId = insertData[0].id;
  
  // Test RLS (Anonymous fetch should be empty since DRAFT)
  const anonSupabase = createClient('https://ruxinzqymhlypxivyjbp.supabase.co', 'sb_publishable_5N4xWqmUoUphXKT881A25g_g1kLwqyO');
  const { data: anonData } = await anonSupabase.from('couples').select('*').eq('id', coupleId);
  console.log('RLS Anonymous Read on DRAFT (Expected length 0):', anonData.length);
  
  // Update to PUBLISHED
  await supabase.from('couples').update({ status: 'PUBLISHED' }).eq('id', coupleId);
  
  const { data: anonDataPublished } = await anonSupabase.from('couples').select('*').eq('id', coupleId);
  console.log('RLS Anonymous Read on PUBLISHED (Expected length 1):', anonDataPublished.length);
  
  // Clean up
  await supabase.from('couples').delete().eq('id', coupleId);
  console.log('Test complete!');
}
test();
