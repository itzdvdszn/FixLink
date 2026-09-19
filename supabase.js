const SUPABASE_URL = "https://liykyosnqcebnnnewomx.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_PJMLKaDQbAt4pxg3Bkp8dQ_8H5mYA7Y";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
async function testSupabaseConnection() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase connection error:", error);
  } else {
    console.log("✅ FixLink is connected to Supabase!");
    console.log(data);
  }
}

testSupabaseConnection();