"use client";

import { useEffect, useRef } from "react";

export function ServerBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Resize handling
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        // Particle class for "data packets"
        class Particle {
            x: number;
            y: number;
            speed: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = 0.5 + Math.random() * 1.5;
                this.size = 1 + Math.random() * 2;
                this.color = Math.random() > 0.5 ? "#3b82f6" : "#10b981"; // Blue or Green
            }

            update() {
                this.y -= this.speed;
                if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw trail
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.5;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.speed * 10);
                ctx.stroke();
            }
        }

        // Grid / Server Rack Effect
        const drawGrid = () => {
            if (!ctx) return;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            ctx.lineWidth = 1;

            const gridSize = 40;

            // Vertical lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((width * height) / 10000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Draw background
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            drawGrid();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Blinking "Server Lights"
            if (Math.random() > 0.9) {
                const x = Math.floor(Math.random() * (width / 40)) * 40;
                const y = Math.floor(Math.random() * (height / 40)) * 40;
                ctx.fillStyle = Math.random() > 0.5 ? "rgba(59, 130, 246, 0.5)" : "rgba(16, 185, 129, 0.5)";
                ctx.fillRect(x + 10, y + 10, 20, 20);
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
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full -z-10 opacity-60"
        />
    );
}
