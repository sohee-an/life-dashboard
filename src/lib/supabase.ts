import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 사용자가 로그인을 했는지 로그아웃을 했는지 체크하는 함수 헬퍼
export const subscribeAuth = (
  handler: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => supabase.auth.onAuthStateChange(handler);
