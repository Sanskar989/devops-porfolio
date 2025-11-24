"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Server, Shield, Code, Database, Globe, Briefcase, Calendar, MapPin, Award, Terminal, Cpu, ExternalLink, Mail } from "lucide-react";
import Image from "next/image";
import { LoadBalancerGame } from "@/components/games/load-balancer-game";
import { CidrQuiz } from "@/components/games/cidr-quiz";
import { ContactForm } from "@/components/contact-form";
import { CertificationModal } from "@/components/certification-modal";
import { useState } from "react";

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
    title: "Oracle SD 11 Java",
    desc: "Java Certification",
    date: "Oracle University",
    iconColor: "text-red-500"
  }
];

import { ServerBackground } from "@/components/server-background";

export default function Home() {
  const [selectedCert, setSelectedCert] = useState<CertData | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      <main className="flex flex-col gap-24 pb-24 relative z-10">
        {/* Hero Section with Server Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <ServerBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-background z-0" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-primary/20 bg-black/50 backdrop-blur-md px-3 py-1 text-sm font-medium text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>Available for Hire</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent drop-shadow-lg"
              >
                Sanskar Goyal
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-2xl font-medium text-zinc-300 sm:text-3xl drop-shadow-md"
              >
                Dynamic Full-Stack Developer & DevOps Engineer
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-zinc-300 sm:text-xl max-w-2xl drop-shadow-md"
              >
                Deep expertise in AWS, Terraform, Docker, Jenkins, and Linux.
                I blend Full-Stack, AI/ML, and DevOps skills to deliver innovative, high-performance, and business-driven solutions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <motion.div variants={shakeVariant} whileHover="hover">
                  <Button size="lg" className="rounded-full shadow-lg shadow-primary/20" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                    View Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div variants={shakeVariant} whileHover="hover">
                  <Button size="lg" variant="outline" className="rounded-full bg-black/40 backdrop-blur-sm border-zinc-700 hover:bg-black/60" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    Contact Me
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="text-primary" /> Experience
            </h2>
          </div>
          <div className="relative border-l border-zinc-800 ml-3 space-y-12">
            {[
              {
                role: "Associate DevOps Engineer",
                company: "Minfy Technologies Pvt. Ltd.",
                location: "Hyderabad, India",
                period: "Oct 2025 – Present",
                desc: [
                  "Working on AWS-based automation projects involving ECS, ECR, S3, Terraform, and CI/CD pipelines.",
                  "Enhancing deployment reliability, monitoring observability, and cost optimization for client workloads."
                ]
              },
              {
                role: "Tech Intern (SDE-DevOps)",
                company: "Minfy Technologies",
                location: "Hyderabad, India",
                period: "Apr 2025 - Sept 2025",
                desc: [
                  "Automated CI/CD for microservices in Jenkins, reducing manual effort by 40%.",
                  "Standardized container releases by scripting image tag/push to Amazon ECR (Bash, Docker)."
                ]
              }
            ].map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="ml-8 relative"
                whileHover={{ x: 5 }}
              >
                <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full border border-zinc-700 bg-zinc-900 ring-4 ring-background" />
                <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl text-primary">{job.role}</CardTitle>
                        <CardDescription className="text-lg font-medium text-zinc-300">{job.company}</CardDescription>
                      </div>
                      <div className="flex flex-col items-start md:items-end text-sm text-zinc-500 gap-1">
                        <div className="flex items-center gap-1"><Calendar size={14} /> {job.period}</div>
                        <div className="flex items-center gap-1"><MapPin size={14} /> {job.location}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-zinc-400">
                      {job.desc.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="about" className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-12 flex items-center gap-2">
            <Code className="text-primary" /> Technical Skills
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Cloud, title: "DevOps & Cloud", desc: "AWS (Lambda, EC2, S3, ECR, IAM, ECS, Fargate), Terraform, Jenkins, Docker, Linux, GitHub Actions." },
              { icon: Terminal, title: "Languages", desc: "Python, C/C++, JavaScript, TypeScript, Dart, SQL." },
              { icon: Globe, title: "Web/Mobile", desc: "React.js, Node.js, Express.js, Flutter." },
              { icon: Cpu, title: "Machine Learning", desc: "TensorFlow, scikit-learn, SageMaker, RAG-Pipeline." },
              { icon: Server, title: "Tools", desc: "VS Code, Docker, Git, GitHub Actions, Terraform, Jenkins CI/CD." },
              { icon: Database, title: "Monitoring", desc: "Prometheus, Grafana." },
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                variants={shakeVariant}
                whileHover="hover"
              >
                <Card className="h-full border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <skill.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{skill.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{skill.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Preview */}
        <section id="projects" className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Terminal className="text-primary" /> Featured Projects
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div variants={shakeVariant} whileHover="hover">
              <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50 flex flex-col group h-full">
                <div className="aspect-video bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src="/projects/zeploy-banner.jpg"
                    alt="ZEPLOY Project"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="rounded-full" onClick={() => window.open('https://github.com/Sanskar989/ZEPLOY', '_blank')}>
                      View Code <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>ZEPLOY</CardTitle>
                  <CardDescription>Custom AWS CLI tool that streamlines deployments using Docker, Terraform, and ECS Fargate.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">AWS ECS</span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">Terraform</span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">Go/Python</span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">Prometheus</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={shakeVariant} whileHover="hover">
              <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50 flex flex-col group h-full">
                <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <Shield className="h-16 w-16 text-zinc-700 group-hover:text-primary transition-colors duration-300" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="rounded-full" onClick={() => window.open('#', '_blank')}>
                      View Code <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>DevSecOps Pipeline</CardTitle>
                  <CardDescription>Automated security scanning integrated into CI/CD workflows.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">Jenkins</span>
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">SonarQube</span>
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">Trivy</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Games Section */}
        <section id="games" className="container mx-auto px-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="text-center mb-12 relative z-10">
              <h2 className="mb-4 text-3xl font-bold">Interactive Challenges</h2>
              <p className="text-zinc-400">Test your DevOps skills with these custom-built mini-games.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 relative z-10">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-center">Load Balancer Logic</h3>
                <LoadBalancerGame />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-center">CIDR Subnetting Quiz</h3>
                <CidrQuiz />
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-12 flex items-center gap-2">
            <Award className="text-primary" /> Achievements & Certifications
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                variants={shakeVariant}
                whileHover="hover"
                onClick={() => {
                  if (cert.badgeSrc && cert.certSrc) {
                    setSelectedCert(cert);
                  }
                }}
                className={cert.badgeSrc ? "cursor-pointer" : ""}
              >
                <Card className="h-full border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10 ${cert.iconColor.replace('text-', 'bg-')} ${cert.iconColor} relative overflow-hidden`}>
                      <Image
                        src="/icons/achievement-icon.png"
                        alt="Achievement"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{cert.title}</CardTitle>
                      <CardDescription>{cert.desc}</CardDescription>
                      <p className="text-xs text-zinc-500 mt-1">{cert.date}</p>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto px-4 pb-12">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">Ready to <span className="text-primary">Collaborate?</span></h2>
              <p className="text-lg text-zinc-400">
                Whether you have a question about my work, want to discuss a project, or just want to say hi, I'd love to hear from you.
              </p>
              <div className="flex flex-col gap-4 text-zinc-400">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <span>sanskargoyal00@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <span>Hyderabad, India</span>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>

      </main>

      {/* Background Elements - Moving Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div
          variants={floatingVariant}
          animate="animate"
          className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[100px]"
        />
        <motion.div
          variants={floatingVariant}
          animate="animate"
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[120px]"
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
