import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://ziyjnvpcqbagloalwnve.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeWpudnBjcWJhZ2xvYWx3bnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDA2NTEsImV4cCI6MjA2MDI3NjY1MX0.JSB6vvEkAiHUAuHynzG4Qp864dAooIvEONBa1AotMx8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
