import { getSpec } from '@/lib/supabase/getSpec';
import DEFAULT_SPEC_TEXT from '@/constants/default-spec-text';
import HomeView from '@/components/HomeView/HomeView';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const savedSpec = user ? await getSpec(supabase, user.id) : null;
  const isSignedIn = Boolean(user);

  return <HomeView initialSpec={savedSpec ?? DEFAULT_SPEC_TEXT} isSignedIn={isSignedIn} />;
}
