import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-zinc-500 relative z-10">
            <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                <div className="flex gap-6">
                    <a href="https://github.com/Sanskar989" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                        <Github size={20} />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/sanskar-goyal-a00a3b221/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                        <Linkedin size={20} />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href="mailto:sanskargoyal00@gmail.com" className="text-zinc-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                        <Mail size={20} />
                        <span className="sr-only">Email</span>
                    </a>
                </div>
                <p>&copy; {new Date().getFullYear()} Sanskar Goyal. Built with Next.js, Tailwind, and Framer Motion.</p>
            </div>
        </footer>
    );
}
