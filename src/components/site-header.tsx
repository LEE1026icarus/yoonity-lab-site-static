"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import { MAIN_NAV_LINKS, SUBMENU_LINKS } from "@/data/site-navigation";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`transition-[padding,background-color,backdrop-filter,border-color] duration-300 border-b ${
          scrolled
            ? "bg-paper/80 backdrop-blur-md border-hairline py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <Link
            href="/#top"
            aria-label="Yoonity 홈"
            className="relative block h-[30px] w-[106px] shrink-0 overflow-hidden bg-black"
          >
            <Image
              src="/yoonity-logo-black.png"
              alt="Yoonity"
              width={4321}
              height={4321}
              priority
              sizes="241px"
              className="absolute left-[-68px] top-[-105px] h-[241px] w-[241px] max-w-none"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
            {MAIN_NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.submenu && setActiveSubmenu(link.submenu)}
                onMouseLeave={() => link.submenu && setActiveSubmenu(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 transition-colors hover:text-ink"
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDownIcon
                      className={`size-4 transition-transform duration-200 ${
                        activeSubmenu === link.submenu ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {link.submenu && (
                  <AnimatePresence>
                    {activeSubmenu === link.submenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-hairline bg-paper-raised shadow-lg"
                      >
                        <div className="flex flex-col gap-1 p-3">
                          {SUBMENU_LINKS[link.submenu].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="rounded px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-ink"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            <Link
              href="/about"
              className="transition-colors hover:text-ink"
            >
              연구실 소개
            </Link>
            <a
              href="https://aqmri.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 flex items-center gap-2 border-l border-hairline pl-5 font-semibold text-ink transition-colors hover:text-axis-quantum"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-axis-quantum shadow-[0_0_12px_rgba(47,217,200,0.7)]"
              />
              AQMRI 연구소
              <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
            </a>
          </nav>

          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-ink transition-transform ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-ink transition-transform ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-hairline bg-paper md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {MAIN_NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.submenu ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSubmenu(
                          activeSubmenu === link.submenu ? null : link.submenu
                        )
                      }
                      className="flex w-full items-center justify-between py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      <span>{link.label}</span>
                      <ChevronDownIcon
                        className={`size-4 transition-transform duration-200 ${
                          activeSubmenu === link.submenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  )}
                  {link.submenu && activeSubmenu === link.submenu && (
                    <div className="flex flex-col gap-1 pl-4">
                      {SUBMENU_LINKS[link.submenu].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block py-2 text-sm text-ink transition-colors hover:text-axis-quantum"
              >
                연구실 소개
              </Link>
              <a
                href="https://aqmri.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex w-fit items-center gap-2 border-l border-hairline py-2 pl-4 text-sm font-semibold text-ink transition-colors hover:text-axis-quantum"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-axis-quantum" />
                AQMRI 연구소
                <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
