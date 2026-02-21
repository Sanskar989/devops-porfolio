"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Network, Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    explanation: string;
}

const questions: Question[] = [
    {
        id: 1,
        question: "What is the subnet mask for a /24 network?",
        options: ["255.255.0.0", "255.255.255.0", "255.255.255.128", "255.255.255.252"],
        correctAnswer: 1,
        explanation: "/24 means 24 bits are set to 1. 11111111.11111111.11111111.00000000 = 255.255.255.0",
    },
    {
        id: 2,
        question: "How many usable IP addresses are in a /28 subnet?",
        options: ["14", "16", "30", "6"],
        correctAnswer: 0,
        explanation: "32 - 28 = 4 host bits. 2^4 = 16 total IPs. Usable = 16 - 2 (Network & Broadcast) = 14.",
    },
    {
        id: 3,
        question: "Which CIDR notation represents 255.255.255.192?",
        options: ["/25", "/26", "/27", "/28"],
        correctAnswer: 1,
        explanation: "192 in binary is 11000000. That's 2 bits. 24 + 2 = /26.",
    },
    {
        id: 4,
        question: "What is the wildcard mask for /24?",
        options: ["0.0.0.255", "0.0.255.255", "0.255.255.255", "255.255.255.0"],
        correctAnswer: 0,
        explanation: "Wildcard is the inverse of the subnet mask. 255.255.255.255 - 255.255.255.0 = 0.0.0.255.",
    },
];

export function CidrQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleOptionClick = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer

        setSelectedOption(index);
        const correct = index === questions[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setScore(0);
        setShowResult(false);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-zinc-900/80 border-zinc-800 h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    CIDR Subnetting Quiz
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
                {showResult ? (
                    <div className="text-center space-y-6">
                        <div className="text-4xl font-bold text-primary">
                            {score} / {questions.length}
                        </div>
                        <p className="text-zinc-400">
                            {score === questions.length ? "Perfect! You are a subnetting master." : "Keep practicing your binary math!"}
                        </p>
                        <Button onClick={resetQuiz} className="w-full">Try Again</Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs font-mono text-zinc-500">Question {currentQuestion + 1} of {questions.length}</span>
                            <h3 className="text-xl font-medium">{questions[currentQuestion].question}</h3>
                        </div>

                        <div className="grid gap-3">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(index)}
                                    disabled={selectedOption !== null}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border text-left transition-all",
                                        selectedOption === null ? "hover:bg-zinc-800 border-zinc-700" :
                                            index === questions[currentQuestion].correctAnswer ? "bg-green-500/20 border-green-500 text-green-400" :
                                                selectedOption === index ? "bg-red-500/20 border-red-500 text-red-400" :
                                                    "opacity-50 border-zinc-800"
                                    )}
                                >
                                    <span>{option}</span>
                                    {selectedOption !== null && index === questions[currentQuestion].correctAnswer && (
                                        <Check className="h-4 w-4" />
                                    )}
                                    {selectedOption === index && index !== questions[currentQuestion].correctAnswer && (
                                        <X className="h-4 w-4" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedOption !== null && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="rounded-lg bg-zinc-800/50 p-4 text-sm text-zinc-300"
                                >
                                    <p><span className="font-bold text-primary">Explanation:</span> {questions[currentQuestion].explanation}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
            {!showResult && selectedOption !== null && (
                <CardFooter>
                    <Button onClick={nextQuestion} className="w-full">
                        {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
