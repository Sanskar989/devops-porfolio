import { Github, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-primary/5 bg-black py-12 text-center text-sm text-zinc-500 relative z-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                <div className="flex gap-6">
                    <a href="https://github.com/Sanskar989" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-primary transition-all duration-200 hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(0,255,213,0.4)]">
                        <Github size={20} />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/sanskar-goyal-a00a3b221/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-primary transition-all duration-200 hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(0,255,213,0.4)]">
                        <Linkedin size={20} />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href="mailto:sanskargoyal00@gmail.com" className="text-zinc-500 hover:text-primary transition-all duration-200 hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(0,255,213,0.4)]">
                        <Mail size={20} />
                        <span className="sr-only">Email</span>
                    </a>
                    <a href="tel:+919981541651" className="text-zinc-500 hover:text-primary transition-all duration-200 hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(0,255,213,0.4)]">
                        <Phone size={20} />
                        <span className="sr-only">Phone</span>
                    </a>
                </div>
                <p className="text-zinc-600">&copy; {new Date().getFullYear()} Sanskar Goyal. Built with Next.js, Tailwind, and Framer Motion.</p>
            </div>
        </footer>
    );
}
