import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fuegadzsxpqenqcsktfk.supabase.co';
const supabaseAnonKey = 'sb_publishable_b7noYDlJ2NnTEI0iB_twfg_YCPwQMgP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);