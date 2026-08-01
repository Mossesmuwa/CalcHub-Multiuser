// Runs on Supabase's servers, not in the browser - this is the only place
// the admin key is allowed to exist. Deploy with the Supabase CLI:
//   supabase functions deploy delete-account

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // this is the user's own login token, sent from the app - it proves who's asking
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    // a normal client, just to check whose token this is
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
    );
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    // the admin client - this key can bypass RLS, which is exactly why it
    // only ever runs here on the server, never in the app itself
    const admin = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    );

    // clean up their data first, then the login itself
    await admin.from("calculations").delete().eq("user_id", user.id);
    await admin.from("notes").delete().eq("user_id", user.id);
    await admin.from("profiles").delete().eq("id", user.id);
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
