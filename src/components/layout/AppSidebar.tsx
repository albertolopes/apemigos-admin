'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext'; // Importando do local correto

export default function AppSidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Notícias', path: '/dashboard/noticias' },
    // Adicione mais itens aqui
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      } min-h-screen flex flex-col`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className={`font-bold text-xl ${!isExpanded && 'hidden'}`}>Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              pathname === item.path
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <span className={`${!isExpanded && 'hidden'}`}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleSidebar}
          className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          {isExpanded ? 'Recolher' : 'Expandir'}
        </button>
      </div>
    </aside>
  );
}
