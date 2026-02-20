"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface CardNavProps {
  className?: string;
}

export function CardNav({ className }: CardNavProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const navLinks = [
    { label: "Compare", href: "/" },
    { label: "History", href: "/history" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          className
        )}
      >
        
        <div className="mx-auto mt-3 max-w-5xl px-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex items-center justify-between rounded-2xl px-4 h-[52px] transition-all duration-300 border border-border",
              scrolled
                ? "bg-background/95 shadow-lg backdrop-blur-xl"
                : "bg-background/80 backdrop-blur-md"
            )}
          >
           
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent pointer-events-none" />

            
            <Link
              href="/"
              className="group flex items-center gap-2.5 outline-none"
              aria-label="DiffVault Home"
            >
              
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 shadow-[0_0_12px_rgba(74,222,128,0.15)]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-emerald-500">
                  <path d="M2 4.5h4M2 7h6M2 9.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M8 4.5h4M9 7h3M9.5 9.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M7 2v10" stroke="currentColor" strokeOpacity={0.3} strokeWidth="1" strokeDasharray="2 1.5"/>
                </svg>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[15px] font-bold tracking-[-0.03em] text-foreground group-hover:opacity-90 transition-colors font-['Geist_Mono',monospace]">
                  Diff<span className="text-emerald-500">Vault</span>
                </span>
                
                <span className="text-[9px] font-semibold text-muted-foreground tracking-widest uppercase px-1 py-0.5 rounded border border-border bg-muted/50 font-mono leading-none">
                  v1
                </span>
              </div>
            </Link>

           
            <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-200 font-['Geist_Mono',monospace] tracking-wide",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 rounded-lg bg-muted border border-border"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            
            <div className="flex items-center gap-2">

            

              
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  aria-label={isDark ? "Switch to light" : "Switch to dark"}
                  className="group relative flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-muted/50 hover:bg-muted hover:border-border transition-all duration-200 text-muted-foreground hover:text-foreground"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isDark ? "sun" : "moon"}
                      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-center"
                    >
                      {isDark ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="4"/>
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                        </svg>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              )}

              
              <Link
                href="/"
                className="group relative hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12px] font-semibold text-white tracking-wide font-['Geist_Mono',monospace] overflow-hidden transition-all duration-200 bg-emerald-500 hover:bg-emerald-600 dark:shadow-[0_0_16px_rgba(74,222,128,0.25)] hover:dark:shadow-[0_0_24px_rgba(74,222,128,0.4)]"
              >
                
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative z-10 shrink-0">
                  <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <span className="relative z-10">New diff</span>
              </Link>

              
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="md:hidden flex flex-col items-center justify-center w-8 h-8 rounded-lg border border-border bg-muted/50 gap-[5px] hover:bg-muted transition-colors"
              >
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block w-[14px] h-[1.5px] bg-foreground/60 rounded-full"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.15 }}
                  className="block w-[10px] h-[1.5px] bg-foreground/60 rounded-full"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block w-[14px] h-[1.5px] bg-foreground/60 rounded-full"
                />
              </button>
            </div>
          </motion.div>

          
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden"
              >
                
                <div className="flex flex-col p-2 gap-0.5">
                  {navLinks.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium font-mono transition-colors",
                            isActive
                              ? "bg-muted text-foreground border border-border"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {link.label}
                          {isActive && (
                            <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-2 pt-0">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold font-mono tracking-wide hover:bg-emerald-600 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    New diff
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="h-[72px]" aria-hidden />
    </>
  );
}