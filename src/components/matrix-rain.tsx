"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let columns: number[] = [];
        const fontSize = 14;
        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

        const handleResize = () => {
            width = canvas.parentElement?.offsetWidth || window.innerWidth;
            height = canvas.parentElement?.offsetHeight || 200;
            canvas.width = width;
            canvas.height = height;
            const colCount = Math.floor(width / fontSize);
            columns = new Array(colCount).fill(0).map(() => Math.random() * height / fontSize);
        };

        const animate = () => {
            if (!ctx) return;

            // Semi-transparent black overlay for trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < columns.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = columns[i] * fontSize;

                // Vary colors
                const intensity = Math.random();
                if (intensity > 0.95) {
                    ctx.fillStyle = "#ffffff";
                } else if (intensity > 0.7) {
                    ctx.fillStyle = "#00ffd5";
                } else {
                    ctx.fillStyle = "rgba(0, 255, 213, 0.3)";
                }

                ctx.fillText(char, x, y);

                if (y > height && Math.random() > 0.98) {
                    columns[i] = 0;
                }
                columns[i] += 0.5;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative w-full h-24 overflow-hidden opacity-30">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
            {/* Fade edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        </div>
    );
}
