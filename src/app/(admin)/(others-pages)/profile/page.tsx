"use client";

import React, { useEffect, useState } from "react";
import Alert from "@/components/ui/alert/Alert";
import { getUserInfo } from "@/lib/services/authService";

export default function Profile() {
  const [user, setUser] = useState<{ name?: string; email?: string; sub?: string } | null>(null);

  useEffect(() => {
    const info = getUserInfo();
    setUser(info);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8">
        <h3 className="mb-8 text-xl font-semibold text-gray-800 dark:text-white/90">
          Perfil do Usuário
        </h3>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Nome de Usuário
              </p>
              <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                {user?.name || "Carregando..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                {user?.sub || "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <Alert
              variant="info"
              title="Informação"
              message="Para alteração de credenciais ou qualquer outra dúvida, entre em contato com o administrador do sistema. As informações de perfil não podem ser editadas diretamente."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
