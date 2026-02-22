"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Network, Briefcase, Award, Code, GraduationCap, Download, Mail, Menu, X } from "lucide-react";
import { useState } from "react";

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
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-primary/5 bg-black/70 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black">
                        <Terminal size={18} />
                    </div>
                    <span className="hidden sm:inline-block gradient-text font-bold">SG.dev</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:text-primary",
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
                                    <item.icon size={16} />
                                    <span>{item.name}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:text-primary transition-colors"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden absolute top-16 left-0 w-full border-b border-primary/10 bg-black/95 backdrop-blur-3xl px-4 py-4 shadow-2xl"
                >
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive ? "bg-primary/10 text-primary" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                    )}
                                >
                                    <item.icon size={18} className={isActive ? "text-primary" : "text-zinc-500"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </motion.div>
            )}
        </header>
    );
}
