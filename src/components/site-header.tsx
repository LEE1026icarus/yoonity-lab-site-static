"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "지도교수", href: "/professor" },
  { label: "활동", href: "/activities" },
  { label: "출판", href: "/publications" },
  { label: "연구원", href: "/researchers" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#research"
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-80"
            >
              연구실 살펴보기
            </Link>
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#research"
                onClick={() => setMenuOpen(false)}
                className="mt-2 w-fit rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
              >
                연구실 살펴보기
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
