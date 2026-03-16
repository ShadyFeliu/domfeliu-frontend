'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-black text-white flex">
      {!isLoginPage && <AdminSidebar />}
      {/* Main Content Area - offset by sidebar width on desktop if not on login page */}
      <main className={`flex-1 overflow-y-auto w-full min-h-screen ${!isLoginPage ? 'ml-0 md:ml-64 p-8' : 'p-0'}`}>
        {children}
      </main>
    </div>
  );
}
