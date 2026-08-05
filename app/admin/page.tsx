import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  // proxy.ts already redirects unauthenticated/non-admin requests before
  // this renders; this check is defense in depth in case this page is ever
  // reached another way.
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'admin') {
    redirect('/rep');
  }

  return <AdminDashboardClient />;
}
