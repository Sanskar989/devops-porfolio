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
        let pulseWaves: PulseWave[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        // Particle — data packets flowing through the network
        class Particle {
            x: number;
            y: number;
            speed: number;
            size: number;
            color: string;
            alpha: number;
            direction: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = 0.3 + Math.random() * 2;
                this.size = 0.5 + Math.random() * 2.5;
                const colors = ["#00ffd5", "#00d4ff", "#39ff14", "#bf00ff"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = 0.3 + Math.random() * 0.7;
                this.direction = Math.random() > 0.5 ? -1 : 1;
            }

            update() {
                this.y -= this.speed * this.direction;
                this.x += Math.sin(this.y * 0.01) * 0.3;
                if (this.y < -10 || this.y > height + 10) {
                    this.y = this.direction === 1 ? height + 5 : -5;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;

                // Glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;

                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Trail
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.3;
                ctx.globalAlpha = this.alpha * 0.3;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.speed * 15 * this.direction);
                ctx.stroke();

                ctx.restore();
            }
        }

        // Pulse wave — radiating circles from random grid points
        class PulseWave {
            x: number;
            y: number;
            radius: number;
            maxRadius: number;
            alpha: number;
            color: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = 80 + Math.random() * 120;
                this.alpha = 0.4;
                this.color = Math.random() > 0.5 ? "#00ffd5" : "#00d4ff";
            }

            update() {
                this.radius += 0.8;
                this.alpha = 0.4 * (1 - this.radius / this.maxRadius);
            }

            draw() {
                if (!ctx || this.alpha <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            isDead() {
                return this.radius >= this.maxRadius;
            }
        }

        // Hex grid
        const drawHexGrid = () => {
            if (!ctx) return;
            const size = 30;
            const h = size * Math.sqrt(3);
            ctx.strokeStyle = "rgba(0, 255, 213, 0.025)";
            ctx.lineWidth = 0.5;

            for (let row = -1; row < height / h + 1; row++) {
                for (let col = -1; col < width / (size * 3) + 1; col++) {
                    const x = col * size * 3 + (row % 2 === 0 ? 0 : size * 1.5);
                    const y = row * h * 0.5;
                    drawHex(x, y, size * 0.9);
                }
            }
        };

        const drawHex = (cx: number, cy: number, size: number) => {
            if (!ctx) return;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const x = cx + size * Math.cos(angle);
                const y = cy + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        };

        // Connection lines between nearby particles
        const drawConnections = () => {
            if (!ctx) return;
            const maxDist = 100;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.save();
                        ctx.globalAlpha = 0.08 * (1 - dist / maxDist);
                        ctx.strokeStyle = "#00ffd5";
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((width * height) / 6000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        let frame = 0;
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Deep black background
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            drawHexGrid();

            // Draw connections (only check every 3rd frame for perf)
            if (frame % 3 === 0) {
                drawConnections();
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Blinking server lights with glow
            if (Math.random() > 0.85) {
                const gridSize = 30;
                const x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
                const y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
                const lightColor = Math.random() > 0.5 ? "#00ffd5" : "#00d4ff";
                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = lightColor;
                ctx.fillStyle = lightColor;
                ctx.globalAlpha = 0.3 + Math.random() * 0.4;
                ctx.fillRect(x + 8, y + 8, 4, 4);
                ctx.restore();
            }

            // Spawn pulse waves
            if (Math.random() > 0.98) {
                const gridSize = 30;
                const px = Math.floor(Math.random() * (width / gridSize)) * gridSize;
                const py = Math.floor(Math.random() * (height / gridSize)) * gridSize;
                pulseWaves.push(new PulseWave(px, py));
            }

            // Update & draw pulse waves
            pulseWaves = pulseWaves.filter(pw => !pw.isDead());
            pulseWaves.forEach(pw => {
                pw.update();
                pw.draw();
            });

            frame++;
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
            className="absolute inset-0 w-full h-full -z-10 opacity-70"
        />
    );
}
