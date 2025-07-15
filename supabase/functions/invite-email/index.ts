import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get("SB_URL") as string;
const serviceRole = Deno.env.get("SB_SERVICE_ROLE_KEY") as string;

const admin = createClient(supabaseUrl, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false }
});

Deno.serve(async (req) => {
  const { record } = await req.json();
  const { invited_email } = record;

  console.log("Invite attempt for:", invited_email);

  // Envoie l'invitation
  const { data, error } = await admin.auth.admin.inviteUserByEmail(invited_email);

  if (error) {
    console.error("Invite failed:", error);
    return new Response(`KO: ${error.message}`, { status: 500 });
  }

  console.log("Invite sent:", data.user?.email);
  return new Response(`OK: Invite sent`);
});
