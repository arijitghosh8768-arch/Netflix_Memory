const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ruxinzqymhlypxivyjbp.supabase.co', 'sb_publishable_5N4xWqmUoUphXKT881A25g_g1kLwqyO');

async function test() {
  console.log('Registering user...');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'hello@netflix.com',
    password: 'password123'
  });
  
  if (signUpError) {
    console.error('SignUp failed:', signUpError.message);
  } else {
    console.log('SignUp SUCCESS. Session:', !!signUpData.session);
  }
}
test();
