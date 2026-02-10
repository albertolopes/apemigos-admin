import type { Metadata } from "next";
import React from "react";
import { ListIcon, CalenderIcon, UserCircleIcon, ShootingStarIcon } from "@/icons/index";

export const metadata: Metadata = {
  title: "Início | Apemigos Admin",
  description: "Painel Administrativo do Portal APEMIGOS",
};

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12">
      <div className="overflow-hidden bg-white border border-gray-200 rounded-3xl dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm">
        {/* Banner Decorativo Minimalista */}
        <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-300 w-full" />

        <div className="p-8 sm:p-12">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white/90 sm:text-4xl">
              Bem-vindo ao coração do portal APEMIGOS!
            </h1>
            <h2 className="text-xl font-medium text-brand-500 dark:text-brand-400">
              Seu painel de controle para transformar vidas.
            </h2>
          </div>

          <div className="mb-12 space-y-6">
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Este é o Painel Administrativo do Portal APEMIGOS. Mais do que uma ferramenta técnica,
              este é o lugar onde organizamos nossa missão de apoio, carinho e informação para
              pacientes e seus familiares.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-3">
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-brand-500 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
                <ListIcon className="w-6 h-6" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Gerenciar Notícias</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Levar informação confiável para quem precisa.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-brand-500 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
                <CalenderIcon className="w-6 h-6" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Organizar Eventos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unir nossa comunidade em encontros especiais.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-brand-500 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Cuidar dos Cadastros</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manter nossa rede de apoio sempre perto.</p>
            </div>
          </div>

          <div className="p-8 border border-brand-100 bg-brand-50/30 rounded-3xl dark:border-brand-500/20 dark:bg-brand-500/5">
            <div className="flex gap-1 items-start">
              <div className="mt-1 text-brand-500 shrink-0">
                <ShootingStarIcon className="w-6 h-6" />
              </div>
              <p className="italic leading-relaxed text-gray-700 dark:text-gray-300">
                "Cada clique, cada postagem e cada atualização que você faz aqui reverbera lá fora,
                levando esperança e suporte para muita gente em Brasília e no Brasil."
              </p>
            </div>
          </div>

          <div className="mt-12 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
            <p className="text-lg font-medium text-gray-800 dark:text-white/90">
              Vamos trabalhar juntos?
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Use o menu lateral para navegar e fazer a diferença hoje.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
