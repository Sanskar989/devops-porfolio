"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Network, Briefcase, Award, Code, GraduationCap, Download, Mail } from "lucide-react";

const navItems = [
    { name: "Home", href: "/", icon: Terminal },
    { name: "Experience", href: "#experience", icon: Briefcase },
    { name: "Skills", href: "#skills", icon: Code },
    { name: "Projects", href: "#projects", icon: Cpu },
    { name: "Education", href: "#education", icon: GraduationCap },
    { name: "Achievements", href: "#achievements", icon: Award },
    { name: "Resume", href: "#resume", icon: Download },
    { name: "Games", href: "#games", icon: Network },
    { name: "Contact", href: "#contact", icon: Mail },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 z-50 w-full border-b border-primary/5 bg-black/70 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black">
                        <Terminal size={18} />
                    </div>
                    <span className="hidden sm:inline-block gradient-text font-bold">SG.dev</span>
                </div>

                <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:text-primary whitespace-nowrap",
                                    isActive ? "text-primary" : "text-zinc-500"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 rounded-full bg-primary/5 border border-primary/10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5">
                                    <item.icon size={14} />
                                    <span className="hidden md:inline-block">{item.name}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
