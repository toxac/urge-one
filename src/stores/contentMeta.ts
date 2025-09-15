// Main store for content
// stores/content.ts
import { atom } from 'nanostores';
import { type Database } from "../../database.types.ts";
import { supabaseBrowserClient } from '../lib/supabase/client.ts';

type Content = Database['public']['Tables']['content_meta']['Row'];

const supabase = supabaseBrowserClient;

export const contentMetaStore = atom<Content[] | []>([]);
export const isContentMetaLoading = atom(false);

export async function fetchContentMeta() {
  isContentMetaLoading.set(true);
  try {
    const { data, error } = await supabase
      .from('content_meta')
      .select('*')

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No content data returned');
    }

    isContentMetaLoading.set(false);

    return {data: data, error: null}
  } catch (error) {
    return {error: error, data: null}
  }
}

