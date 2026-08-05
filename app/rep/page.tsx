import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import RepDashboardClient from './RepDashboardClient';

export default async function RepPage() {
  // proxy.ts already redirects unauthenticated requests before this renders;
  // this check is defense in depth in case this page is ever reached another way.
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return <RepDashboardClient repName={session.name} role={session.role} />;
}
