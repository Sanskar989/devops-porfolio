"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Laptop, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type ServerStatus = "healthy" | "unhealthy" | "overloaded";

interface ServerNode {
    id: number;
    load: number;
    status: ServerStatus;
}

export function LoadBalancerGame() {
    const [servers, setServers] = useState<ServerNode[]>([
        { id: 1, load: 0, status: "healthy" },
        { id: 2, load: 0, status: "healthy" },
        { id: 3, load: 0, status: "healthy" },
    ]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [requests, setRequests] = useState<number[]>([]);

    // Game Loop: Generate requests
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setRequests((prev) => [...prev, Date.now()]);
        }, 2000); // New request every 2 seconds

        return () => clearInterval(interval);
    }, [gameOver]);

    // Server Load Decay
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setServers((prev) =>
                prev.map((s) => ({
                    ...s,
                    load: Math.max(0, s.load - 10), // Decay load
                    status: s.load > 80 ? "overloaded" : s.status === "unhealthy" ? "unhealthy" : "healthy",
                }))
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [gameOver]);

    const handleRouteRequest = (serverId: number) => {
        if (gameOver) return;
        if (requests.length === 0) return;

        // Remove oldest request
        setRequests((prev) => prev.slice(1));

        setServers((prev) =>
            prev.map((s) => {
                if (s.id !== serverId) return s;

                const newLoad = s.load + 20;
                let newStatus = s.status;

                if (newLoad > 100) {
                    setGameOver(true);
                    newStatus = "overloaded";
                } else if (newLoad > 80) {
                    newStatus = "overloaded";
                }

                return { ...s, load: newLoad, status: newStatus };
            })
        );

        setScore((prev) => prev + 10);
    };

    const resetGame = () => {
        setServers([
            { id: 1, load: 0, status: "healthy" },
            { id: 2, load: 0, status: "healthy" },
            { id: 3, load: 0, status: "healthy" },
        ]);
        setScore(0);
        setGameOver(false);
        setRequests([]);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-zinc-900/80 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <RefreshCw className={cn("h-5 w-5", gameOver ? "text-red-500" : "text-green-500")} />
                    Load Balancer Logic
                </CardTitle>
                <div className="text-xl font-mono font-bold text-primary">Score: {score}</div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-8">

                    {/* Incoming Requests Queue */}
                    <div className="flex items-center justify-center h-16 bg-zinc-950/50 rounded-lg border border-zinc-800 relative overflow-hidden">
                        <div className="absolute left-4 text-xs text-zinc-500 font-mono uppercase">Request Queue</div>
                        <div className="flex gap-2 items-center">
                            <AnimatePresence>
                                {requests.map((r) => (
                                    <motion.div
                                        key={r}
                                        initial={{ scale: 0, x: -20 }}
                                        animate={{ scale: 1, x: 0 }}
                                        exit={{ scale: 0, x: 20, opacity: 0 }}
                                        className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    />
                                ))}
                            </AnimatePresence>
                            {requests.length === 0 && <span className="text-zinc-600 text-sm">Waiting for traffic...</span>}
                        </div>
                    </div>

                    {/* Load Balancer (User) */}
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-zinc-800 border border-zinc-700">
                            <Laptop className="h-8 w-8 text-zinc-400" />
                        </div>
                    </div>

                    {/* Servers */}
                    <div className="grid grid-cols-3 gap-4">
                        {servers.map((server) => (
                            <button
                                key={server.id}
                                onClick={() => handleRouteRequest(server.id)}
                                disabled={gameOver}
                                className={cn(
                                    "relative flex flex-col items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                                    server.status === "healthy" ? "border-green-500/20 bg-green-500/5 hover:bg-green-500/10" :
                                        server.status === "overloaded" ? "border-yellow-500/50 bg-yellow-500/10" :
                                            "border-red-500/50 bg-red-500/10"
                                )}
                            >
                                <div className="relative">
                                    <Server className={cn("h-8 w-8",
                                        server.status === "healthy" ? "text-green-400" :
                                            server.status === "overloaded" ? "text-yellow-400" : "text-red-400"
                                    )} />
                                    {server.status === "healthy" && <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-500 bg-black rounded-full" />}
                                    {server.status === "overloaded" && <RefreshCw className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 bg-black rounded-full animate-spin" />}
                                </div>

                                <div className="w-full space-y-1">
                                    <div className="flex justify-between text-xs text-zinc-400">
                                        <span>Server {server.id}</span>
                                        <span>{server.load}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn("h-full rounded-full",
                                                server.load > 80 ? "bg-red-500" :
                                                    server.load > 50 ? "bg-yellow-500" : "bg-green-500"
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${server.load}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {gameOver && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                            <div className="text-center space-y-4 p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
                                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                                <h3 className="text-2xl font-bold">System Crash!</h3>
                                <p className="text-zinc-400">You overloaded a server. Total Score: {score}</p>
                                <Button onClick={resetGame} variant="default">Reboot System</Button>
                            </div>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}
