import { redirect } from 'next/navigation';
import { destroySession, getSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';
import RepDashboardClient from './RepDashboardClient';

export default async function RepPage() {
  // proxy.ts already redirects unauthenticated requests before this renders;
  // this check is defense in depth in case this page is ever reached another way.
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const { data: rep } = await supabaseAdmin
    .from('reps')
    .select('agreed_at')
    .eq('id', session.repId)
    .maybeSingle();

  if (!rep?.agreed_at) {
    await destroySession();
    redirect('/login');
  }

  return <RepDashboardClient repName={session.name} role={session.role} />;
}
