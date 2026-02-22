"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight, Cloud, Server, Shield, Code, Database, Globe,
  Briefcase, Calendar, MapPin, Award, Terminal, Cpu, ExternalLink,
  Mail, Download, GraduationCap, Monitor, GitBranch, Container,
  Layers, BarChart3, FileCode, Smartphone, Brain, Eye
} from "lucide-react";
import Image from "next/image";
import { DockerTerminal } from "@/components/games/docker-terminal";
import { KubernetesTerminal } from "@/components/games/kubernetes-terminal";
import { IncidentResponseTerminal } from "@/components/games/incident-response-terminal";
import { ContactForm } from "@/components/contact-form";
import { CertificationModal } from "@/components/certification-modal";
import { MatrixRain } from "@/components/matrix-rain";
import { useState, useEffect } from "react";
import { ServerBackground } from "@/components/server-background";

// Animation Variants
const shakeVariant = {
  hover: {
    x: [0, -2, 2, -2, 2, 0],
    transition: { duration: 0.4 }
  }
};

const floatingVariant = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface CertData {
  title: string;
  desc: string;
  date: string;
  badgeSrc?: string;
  certSrc?: string;
  iconColor: string;
}

const certifications: CertData[] = [
  {
    title: "Oracle Cloud DevOps Professional",
    desc: "DevOps Professional 2025",
    date: "Oct 2025 - Oct 2028",
    badgeSrc: "/certificates/oracle-devops-badge.jpg",
    certSrc: "/certificates/oracle-devops-cert.png",
    iconColor: "text-red-500"
  },
  {
    title: "Oracle Cloud Multicloud Architect",
    desc: "Multicloud Architect 2025",
    date: "Oct 2025 - Oct 2028",
    badgeSrc: "/certificates/oracle-multicloud-badge.jpg",
    certSrc: "/certificates/oracle-multicloud-cert.png",
    iconColor: "text-red-500"
  },
  {
    title: "AWS Certified Solutions Architect",
    desc: "Solutions Architect Associate",
    date: "Dec 2025 – Dec 2028",
    badgeSrc: "/certificates/aws-sa-badge.png",
    certSrc: "/certificates/aws-sa-cert.png",
    iconColor: "text-orange-500"
  }
];

// Skills data
const skillCategories = [
  {
    icon: Cloud,
    title: "Cloud Platform",
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "hover:border-cyan-500/50",
    skills: ["EC2", "S3", "IAM", "VPC", "Lambda", "ECR", "ECS", "EKS", "Fargate", "ALB", "Auto Scaling"]
  },
  {
    icon: GitBranch,
    title: "DevOps & CI/CD",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "hover:border-green-500/50",
    skills: ["CI/CD Pipelines", "Jenkins", "GitHub Actions", "Build Automation", "Release Management"]
  },
  {
    icon: Container,
    title: "Containerization",
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "hover:border-blue-500/50",
    skills: ["Docker", "Multi-stage Builds", "Kubernetes", "Helm"]
  },
  {
    icon: Layers,
    title: "Infrastructure as Code",
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "hover:border-purple-500/50",
    skills: ["Terraform", "AWS CloudFormation"]
  },
  {
    icon: BarChart3,
    title: "Monitoring & Observability",
    color: "from-yellow-500/20 to-orange-500/20",
    borderColor: "hover:border-yellow-500/50",
    skills: ["Prometheus", "Grafana", "AWS CloudWatch", "Alerting", "Incident Management"]
  },
  {
    icon: Terminal,
    title: "OS & Scripting",
    color: "from-lime-500/20 to-green-500/20",
    borderColor: "hover:border-lime-500/50",
    skills: ["Linux", "Bash", "Python"]
  },
  {
    icon: FileCode,
    title: "Programming Languages",
    color: "from-cyan-500/20 to-teal-500/20",
    borderColor: "hover:border-cyan-500/50",
    skills: ["Python", "C/C++", "JavaScript", "TypeScript", "Dart", "SQL"]
  },
  {
    icon: Smartphone,
    title: "Web & Mobile",
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "hover:border-pink-500/50",
    skills: ["React.js", "Node.js", "Express.js", "Flutter"]
  },
  {
    icon: Brain,
    title: "Machine Learning",
    color: "from-violet-500/20 to-fuchsia-500/20",
    borderColor: "hover:border-violet-500/50",
    skills: ["TensorFlow", "Scikit-learn", "AWS SageMaker", "RAG Pipelines"]
  },
  {
    icon: Code,
    title: "Version Control",
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "hover:border-orange-500/50",
    skills: ["Git", "GitHub"]
  },
];

// Animated counter
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const [selectedCert, setSelectedCert] = useState<CertData | null>(null);

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      <main className="flex flex-col gap-0 pb-24 relative z-10">
        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 scanline-overlay">
          <ServerBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-0" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-primary/20 bg-black/70 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-primary neon-glow"
              >
                <span className="w-2 h-2 rounded-full bg-primary mr-2 status-dot" />
                <span>Available for Hire</span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
              >
                <span className="gradient-text">Sanskar Goyal</span>
              </motion.h1>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-xl font-medium text-zinc-300 sm:text-2xl lg:text-3xl flex items-center gap-3 flex-wrap justify-center"
              >
                <span className="text-primary">{'>'}</span>
                Associate DevOps Engineer
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">AWS</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">Terraform</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">CI/CD</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">Kubernetes</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-zinc-400 sm:text-lg max-w-2xl leading-relaxed"
              >
                Associate DevOps Engineer with extensive experience in architecting{" "}
                <span className="text-primary font-medium">AWS-native infrastructure</span> and high-availability CI/CD ecosystems.
                Proven track record in real-time production debugging, Terraform-based IaC, and{" "}
                <span className="text-primary font-medium">MLOps pipelines</span>.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex gap-8 sm:gap-12"
              >
                {[
                  { value: 3, suffix: "+", label: "Certifications" },
                  { value: 10, suffix: "+", label: "Cloud Tools" },
                  { value: 2, suffix: "+", label: "Years Exp" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary text-glow">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <motion.div variants={shakeVariant} whileHover="hover">
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg shadow-primary/20 bg-primary text-black hover:bg-primary/90 font-semibold"
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div variants={shakeVariant} whileHover="hover">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full bg-black/40 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary"
                    onClick={() => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Download className="mr-2 h-4 w-4" /> Resume
                  </Button>
                </motion.div>
                <motion.div variants={shakeVariant} whileHover="hover">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full bg-black/40 backdrop-blur-sm border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Contact Me
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Matrix divider */}
        <MatrixRain />

        {/* ═══════════ EXPERIENCE SECTION ═══════════ */}
        <section id="experience" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <Briefcase className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Work <span className="text-primary">Experience</span>
              </h2>
            </div>
            <p className="text-zinc-500 ml-[52px]">Building resilient, multi-tenant cloud architectures</p>
          </motion.div>

          <div className="relative border-l-2 border-primary/20 ml-5 space-y-12">
            {[
              {
                role: "Associate DevOps Engineer",
                company: "Minfy Technologies Pvt. Ltd.",
                location: "Hyderabad, India",
                period: "Oct 2025 – Present",
                current: true,
                desc: [
                  "Architecting AWS-native infrastructure and high-availability CI/CD ecosystems for enterprise clients.",
                  "Real-time production debugging, resolving complex networking bottlenecks, and managing incident response.",
                  "Automating Docker–ECR–ECS workflows with ZEPLOY, a production-grade deployment tool.",
                  "Enhancing deployment reliability, monitoring observability, and cost optimization for client workloads.",
                  "Highly proficient in Terraform-based IaC, Kubernetes orchestration, and MLOps pipelines."
                ]
              },
              {
                role: "Tech Intern (SDE-DevOps)",
                company: "Minfy Technologies",
                location: "Hyderabad, India",
                period: "Apr 2025 - Sept 2025",
                current: false,
                desc: [
                  "Automated CI/CD for microservices in Jenkins (Declarative & Multibranch), reducing manual effort by 40%.",
                  "Standardized container releases by scripting image tag/push to Amazon ECR (Bash, Docker).",
                  "Integrated GitHub Actions for continuous integration, enforcing standardized tagging and security scanning.",
                  "Managed Terraform-based infrastructure provisioning across multiple AWS accounts."
                ]
              }
            ].map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="ml-10 relative"
              >
                {/* Timeline dot */}
                <div className={`absolute max-sm:-left-[30px] sm:-left-[46px] top-6 h-4 w-4 rounded-full border-2 ${job.current ? 'border-primary bg-primary/30 neon-glow' : 'border-zinc-700 bg-zinc-900'}`} />

                <Card className="border-zinc-800/50 bg-zinc-950/60 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 neon-border">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl text-primary">{job.role}</CardTitle>
                          {job.current && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1 status-dot" />
                              Current
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-lg font-medium text-zinc-300 mt-1">{job.company}</CardDescription>
                      </div>
                      <div className="flex flex-col items-start md:items-end text-sm text-zinc-500 gap-1">
                        <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary/60" /> {job.period}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary/60" /> {job.location}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.desc.map((d, j) => (
                        <li key={j} className="flex items-start gap-3 text-zinc-400">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ SKILLS SECTION ═══════════ */}
        <section id="skills" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <Code className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Technical <span className="text-primary">Skills</span>
              </h2>
            </div>
            <p className="text-zinc-500 ml-[52px]">Full-stack development meets cloud-native infrastructure</p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skillCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`h-full border-zinc-800/50 bg-zinc-950/40 backdrop-blur-sm ${cat.borderColor} transition-all duration-300 group neon-border`}>
                  <CardHeader className="pb-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <cat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{cat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, j) => (
                        <span key={j} className="skill-pill">{skill}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Matrix divider */}
        <MatrixRain />

        {/* ═══════════ PROJECTS SECTION ═══════════ */}
        <section id="projects" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <Terminal className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Featured <span className="text-primary">Projects</span>
              </h2>
            </div>
            <p className="text-zinc-500 ml-[52px]">Production-grade tools and automation pipelines</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              variants={shakeVariant}
              whileHover="hover"
            >
              <Card className="overflow-hidden border-zinc-800/50 bg-zinc-950/40 flex flex-col group h-full neon-border">
                <div className="aspect-video bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src="/projects/zeploy-banner.jpg"
                    alt="ZEPLOY Project"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/10" onClick={() => window.open('https://github.com/Sanskar989/ZEPLOY', '_blank')}>
                      View Code <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">ZEPLOY</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Production-grade CLI tool abstracting complex AWS Fargate deployments. Multi-stage Docker builds, Terraform provisioning, and Prometheus observability — all in a single command.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {["AWS ECS", "Terraform", "Go/Python", "Prometheus", "Docker", "GitHub Actions"].map(tag => (
                      <span key={tag} className="skill-pill">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              variants={shakeVariant}
              whileHover="hover"
            >
              <Card className="overflow-hidden border-zinc-800/50 bg-zinc-950/40 flex flex-col group h-full neon-border">
                <div className="aspect-video bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,213,0.05)_0%,transparent_70%)]" />
                  <Shield className="h-16 w-16 text-zinc-800 group-hover:text-primary/60 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/10" onClick={() => window.open('#', '_blank')}>
                      View Code <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">DevSecOps Pipeline</CardTitle>
                  <CardDescription className="text-zinc-400">
                    End-to-end automated security scanning integrated into CI/CD workflows. SonarQube code analysis, Trivy container scanning, and automated compliance reporting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {["Jenkins", "SonarQube", "Trivy", "Docker", "AWS"].map(tag => (
                      <span key={tag} className="skill-pill">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ EDUCATION SECTION ═══════════ */}
        <section id="education" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <GraduationCap className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-primary">Education</span>
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                <div className="terminal-dot" style={{ background: '#febc2e' }} />
                <div className="terminal-dot" style={{ background: '#28c840' }} />
                <span className="text-xs text-zinc-500 ml-2 font-mono">education.sh</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-zinc-500">
                  <span className="text-primary">$</span> cat /education/degree
                </div>
                <div className="pl-4 space-y-2">
                  <div className="text-lg font-semibold text-zinc-200 font-sans">
                    B.Tech — Computer Science
                  </div>
                  <div className="text-primary font-sans">
                    SRM Institute of Science and Technology
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-xs">
                    <span className="flex items-center gap-1"><Calendar size={12} /> 2021 – 2025</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> Chennai, India</span>
                  </div>
                </div>
                <div className="text-zinc-600 mt-4">
                  <span className="text-primary">$</span> <span className="text-zinc-400 inline-block border-r-2 border-primary animate-[blink-caret_1s_step-end_infinite]">_</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════ GAMES SECTION ═══════════ */}
        <section id="games" className="container mx-auto px-4 py-24">
          <div className="rounded-3xl border border-zinc-800/50 bg-zinc-950/30 p-8 md:p-12 relative overflow-hidden neon-border">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="text-center mb-12 relative z-10">
              <h2 className="mb-4 text-3xl sm:text-4xl font-bold">
                Interactive <span className="text-primary">Challenges</span>
              </h2>
              <p className="text-zinc-500">Test your cloud engineering skills with real-world scenarios.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 relative z-10">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-center text-zinc-300">🐳 Docker Challenges</h3>
                <DockerTerminal />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-center text-zinc-300">☸️ Kubernetes Challenges</h3>
                <KubernetesTerminal />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-center text-zinc-300">🚨 Incident Response</h3>
                <IncidentResponseTerminal />
              </div>
            </div>
          </div>
        </section>

        {/* Matrix divider */}
        <MatrixRain />

        {/* ═══════════ ACHIEVEMENTS SECTION ═══════════ */}
        <section id="achievements" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <Award className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Achievements & <span className="text-primary">Certifications</span>
              </h2>
            </div>
            <p className="text-zinc-500 ml-[52px]">Industry-recognized cloud and DevOps certifications</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                variants={shakeVariant}
                whileHover="hover"
                onClick={() => {
                  if (cert.badgeSrc && cert.certSrc) {
                    setSelectedCert(cert);
                  }
                }}
                className={cert.badgeSrc ? "cursor-pointer" : ""}
              >
                <Card className="h-full border-zinc-800/50 bg-zinc-950/40 hover:border-primary/30 transition-all duration-300 neon-border group">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cert.iconColor === 'text-red-500' ? 'from-red-500/10 to-orange-500/10' : 'from-orange-500/10 to-yellow-500/10'} border border-zinc-800 group-hover:border-primary/30 transition-colors relative overflow-hidden`}>
                      {cert.badgeSrc ? (
                        <Image
                          src={cert.badgeSrc}
                          alt={cert.title}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <Award className="text-primary" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">{cert.title}</CardTitle>
                      <CardDescription className="text-sm">{cert.desc}</CardDescription>
                      <p className="text-xs text-zinc-600 mt-1">{cert.date}</p>
                      {cert.badgeSrc && (
                        <p className="text-xs text-primary/60 mt-1 flex items-center gap-1">
                          <Eye size={10} /> Click to view
                        </p>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ RESUME SECTION ═══════════ */}
        <section id="resume" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <Download className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                My <span className="text-primary">Resume</span>
              </h2>
            </div>
            <p className="text-zinc-500 ml-[52px]">Download or view my full resume</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-strong rounded-2xl p-8 text-center space-y-6 neon-border">
              <div className="relative w-full aspect-[8.5/11] max-w-md mx-auto rounded-xl overflow-hidden border border-zinc-800 bg-white">
                <Image
                  src="/assets/sanskar_resume.png"
                  alt="Sanskar Goyal Resume"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-zinc-200">Sanskar Goyal — Resume</h3>
                <p className="text-zinc-500 text-sm">Associate DevOps Engineer • AWS • Terraform • CI/CD • Kubernetes</p>
              </div>
              <a href="/assets/sanskar_resume.pdf" download>
                <Button size="lg" className="rounded-full bg-primary text-black hover:bg-primary/90 font-semibold neon-glow px-8">
                  <Download className="mr-2 h-5 w-5" /> Download Resume
                </Button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* ═══════════ GALLERY SECTION ═══════════ */}
        <section id="gallery" className="container mx-auto px-4 py-24">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center neon-border">
                <Monitor className="text-primary" size={20} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-primary">Gallery</span>
              </h2>
            </div>
            <p className="text-zinc-500 ml-[52px]">Moments and milestones</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {[
              { src: "/gallery/photo-1.jpg", alt: "Gallery Photo 1" },
              { src: "/gallery/photo-2.jpg", alt: "Gallery Photo 2" },
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden neon-border glass">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ CONTACT SECTION ═══════════ */}
        <section id="contact" className="container mx-auto px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Ready to <span className="text-primary text-glow">Collaborate?</span>
              </h2>
              <p className="text-lg text-zinc-400">
                Whether you have a question about my work, want to discuss a project, or just want to say hi, I&apos;d love to hear from you.
              </p>
              <div className="flex flex-col gap-4 text-zinc-400">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <span>sanskargoyal00@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <span>Hyderabad, India</span>
                </div>
              </div>
            </motion.div>
            <ContactForm />
          </div>
        </section>

      </main>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div
          variants={floatingVariant}
          animate="animate"
          className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/3 blur-[120px]"
        />
        <motion.div
          variants={floatingVariant}
          animate="animate"
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/3 blur-[140px]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <Footer />

      <CertificationModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title={selectedCert?.title || ""}
        badgeSrc={selectedCert?.badgeSrc || ""}
        certSrc={selectedCert?.certSrc || ""}
      />
    </div>
  );
}
