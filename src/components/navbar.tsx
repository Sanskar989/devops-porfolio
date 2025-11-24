"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Network, User, Briefcase, Award } from "lucide-react";

const navItems = [
    { name: "Home", href: "/", icon: Terminal },
    { name: "Experience", href: "#experience", icon: Briefcase },
    { name: "Projects", href: "#projects", icon: Cpu },
    { name: "Games", href: "#games", icon: Network },
    { name: "Achievements", href: "#achievements", icon: Award },
    { name: "About", href: "#about", icon: User },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Terminal size={18} />
                    </div>
                    <span className="hidden sm:inline-block">DevOps.io</span>
                </div>

                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                                    isActive ? "text-primary" : "text-zinc-400"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 rounded-full bg-white/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon size={16} />
                                    <span className="hidden sm:inline-block">{item.name}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
