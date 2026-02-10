"use client";
import React, { useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { MailIcon, GroupIcon } from "../icons/index";

export default function SidebarWidget() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isRevealed, setIsRevealed] = useState(false);

  const showSidebarContent = isExpanded || isHovered || isMobileOpen;

  // Se o sidebar estiver colapsado, mostramos nada ou algo extremamente sutil
  if (!showSidebarContent) {
    return (
      <div className="flex justify-center py-4">
        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="text-[10px] opacity-20 hover:opacity-100 transition-opacity duration-300"
          title="..."
        >
          ❤️
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-10 w-full max-w-60 px-4 py-2">
      {!isRevealed ? (
        <div className="flex justify-center">
          <button
            onClick={() => setIsRevealed(true)}
            className="text-[10px] opacity-10 hover:opacity-50 transition-opacity duration-500 cursor-default"
          >
            ❤️
          </button>
        </div>
      ) : (
        <div className="animate-fade-in rounded-2xl bg-gray-50 p-5 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 relative group">
          <button
            onClick={() => setIsRevealed(false)}
            className="absolute top-2 right-2 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>

          <div className="flex flex-col gap-4 text-left text-theme-sm">
            <div>
              <h3 className="mb-2 text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Sobre o Desenvolvedor 👨‍💻
              </h3>
              <p className="mb-3 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                Este portal foi desenvolvido com dedicação e propósito por <strong>Alberto Lopes</strong>.
              </p>
              <p className="text-[10px] italic leading-tight text-gray-400 dark:text-gray-500">
                "Como paciente diagnosticado com EM, usei minha experiência em tecnologia para fortalecer a APEMIGOS."
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Vamos conectar?
              </p>
              <ul className="space-y-2 text-[11px] text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="https://github.com/albertolopes"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-brand-500 transition-colors"
                  >
                    <GroupIcon className="w-3 h-3" />
                    GitHub: albertolopes
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:albertolopes@mail.com"
                    className="flex items-center gap-2 hover:text-brand-500 transition-colors"
                  >
                    <MailIcon className="w-3 h-3" />
                    albertolopes@mail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
