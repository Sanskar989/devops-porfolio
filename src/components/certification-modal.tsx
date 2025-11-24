"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    badgeSrc: string;
    certSrc: string;
}

export function CertificationModal({ isOpen, onClose, title, badgeSrc, certSrc }: CertificationModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] p-4"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-zinc-800 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Award size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold">{title}</h3>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-zinc-800">
                                    <X size={20} />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                {/* Badge Section */}
                                <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-zinc-950/50 p-8 border border-zinc-800">
                                    <div className="relative h-48 w-48">
                                        <Image
                                            src={badgeSrc}
                                            alt={`${title} Badge`}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-400">Official Badge</span>
                                </div>

                                {/* Certificate Section */}
                                <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-zinc-950/50 p-4 border border-zinc-800">
                                    <div className="relative h-full w-full min-h-[200px] aspect-[4/3]">
                                        <Image
                                            src={certSrc}
                                            alt={`${title} Certificate`}
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-400">Certificate of Completion</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
