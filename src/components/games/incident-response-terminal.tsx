"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

import { incidentScenarios as incidents } from "@/lib/game-data/incident-scenarios";

export function IncidentResponseTerminal() {
    const [incidentIdx, setIncidentIdx] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ type: "prompt" | "input" | "output" | "error" | "success"; text: string }[]>([]);
    const [completed, setCompleted] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const incident = incidents[incidentIdx];
    const step = incident.steps[stepIdx];

    // Initialize with incident description
    useEffect(() => {
        setHistory([
            { type: "error", text: `🚨 [${incident.severity}] ${incident.title}` },
            { type: "output", text: incident.description },
            { type: "prompt", text: step.prompt },
        ]);
    }, [incidentIdx]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || completed) return;

        const cmd = input.trim().toLowerCase();
        const newHistory = [...history, { type: "input" as const, text: `$ ${input.trim()}` }];

        // Check if command matches any expected command
        const isMatch = step.expectedCommands.some(expected =>
            cmd.includes(expected.toLowerCase())
        );

        if (isMatch) {
            newHistory.push({ type: "output", text: step.output });
            newHistory.push({ type: "success", text: step.successMessage });

            if (stepIdx < incident.steps.length - 1) {
                const nextStep = incident.steps[stepIdx + 1];
                newHistory.push({ type: "prompt", text: nextStep.prompt });
                setStepIdx(s => s + 1);
            } else {
                newHistory.push({ type: "success", text: `\n━━━ Incident Resolved ━━━\nTotal commands: ${stepIdx + 1} | Failed attempts: ${attempts}` });
                setCompleted(true);
            }
        } else {
            setAttempts(a => a + 1);
            newHistory.push({ type: "error", text: `Command not effective. Hint: ${step.hint}` });
        }

        setHistory(newHistory);
        setInput("");
    };

    const nextIncident = () => {
        const next = (incidentIdx + 1) % incidents.length;
        setIncidentIdx(next);
        setStepIdx(0);
        setInput("");
        setCompleted(false);
        setAttempts(0);
    };

    const reset = () => {
        setStepIdx(0);
        setInput("");
        setCompleted(false);
        setAttempts(0);
        setHistory([
            { type: "error", text: `🚨 [${incident.severity}] ${incident.title}` },
            { type: "output", text: incident.description },
            { type: "prompt", text: incident.steps[0].prompt },
        ]);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-zinc-950/80 border-zinc-800/50 neon-border h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Terminal className="h-5 w-5 text-primary" />
                    Incident Response
                </CardTitle>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-xs font-mono px-2 py-0.5 rounded-full border",
                        incident.severity === "P1" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                            incident.severity === "P2" ? "text-orange-400 bg-orange-500/10 border-orange-500/20" :
                                "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                    )}>
                        {incident.severity}
                    </span>
                    <span className="text-xs font-mono text-zinc-600">
                        {stepIdx + 1}/{incident.steps.length}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {/* Terminal */}
                <div className="flex-1 flex flex-col bg-black/80 border-t border-zinc-800 min-h-0">
                    {/* Terminal toolbar */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        <span className="text-[10px] text-zinc-600 ml-2 font-mono">incident-response — bash</span>
                        <div className="ml-auto flex gap-2">
                            <button onClick={reset} className="text-zinc-600 hover:text-primary transition-colors" title="Reset">
                                <RotateCcw size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Output area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1.5 max-h-[320px] min-h-[200px]"
                    >
                        {history.map((entry, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                className={cn(
                                    "whitespace-pre-wrap leading-relaxed",
                                    entry.type === "input" ? "text-cyan-300" :
                                        entry.type === "error" ? "text-red-400" :
                                            entry.type === "success" ? "text-green-400" :
                                                entry.type === "prompt" ? "text-yellow-300 mt-3 border-l-2 border-yellow-500/30 pl-2" :
                                                    "text-zinc-400"
                                )}
                            >
                                {entry.text}
                            </motion.div>
                        ))}
                    </div>

                    {/* Input */}
                    {!completed ? (
                        <form onSubmit={handleSubmit} className="flex items-center border-t border-zinc-800 px-3 py-2">
                            <span className="text-primary font-mono text-xs mr-2">$</span>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your command..."
                                className="flex-1 bg-transparent text-zinc-200 text-xs font-mono outline-none placeholder:text-zinc-700"
                                autoFocus
                            />
                        </form>
                    ) : (
                        <div className="flex items-center gap-2 border-t border-zinc-800 px-3 py-2">
                            <Button onClick={nextIncident} size="sm" className="bg-primary text-black hover:bg-primary/90 text-xs rounded-full h-7">
                                Next Incident →
                            </Button>
                            <span className="text-[10px] text-zinc-600 font-mono">
                                {incidentIdx + 1}/{incidents.length} incidents
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
