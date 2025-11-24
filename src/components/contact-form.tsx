"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name"),
            mobile: formData.get("mobile"),
            email: formData.get("email"),
            company: formData.get("company"),
            role: formData.get("role"),
            timestamp: new Date().toISOString(),
        };

        try {
            await fetch('https://script.google.com/macros/s/AKfycbyUC0BAv7cE9OvgK_0rCKbACXOup7jpZyZrKI5JEdeAjmYqWQguVbSws-roKIusHz21/exec', {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors',
            });

            setIsSuccess(true);
            console.log("Form submitted:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm"
            >
                <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Received! 🚀</h3>
                <p className="text-zinc-400 max-w-xs">
                    Thanks for dropping by! I've got your details and will be in touch shortly. Let's build something awesome together!
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                    Send Another
                </Button>
            </motion.div>
        );
    }

    return (
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardHeader>
                <CardTitle>Let's Connect</CardTitle>
                <CardDescription>Fill out the form below to get in touch.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400">Name</Label>
                            <Input id="name" name="name" required placeholder="John Doe" className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50 transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile" className="text-zinc-400">Mobile No</Label>
                            <Input id="mobile" name="mobile" required placeholder="+91 98765 43210" className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50 transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-400">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50 transition-colors" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-zinc-400">Company</Label>
                            <Input id="company" name="company" placeholder="Tech Corp" className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50 transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-zinc-400">Job Role</Label>
                            <Input id="role" name="role" placeholder="Hiring Manager" className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50 transition-colors" />
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                Send Message <Send className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
