'use client';

import React from 'react';
// Usando os contextos originais do projeto
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/lib/contexts/AuthContext'; // Este é novo, mantemos do lib
import AppSidebar from '@/components/layout/AppSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Header = () => (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Painel Administrativo</h2>
      {/* Adicione elementos do cabeçalho aqui, como dropdown de usuário */}
    </header>
  );

  return (
    // Nota: SidebarProvider e ThemeProvider já estão no RootLayout,
    // mas se este layout for usado independentemente, eles garantem o contexto.
    // Se for aninhado, não tem problema (apenas redundante, mas seguro).
    <ThemeProvider>
      <SidebarProvider>
        <AuthProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
