
"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRef, useEffect } from "react";
import { ArrowDown, LineChart, Rocket, Star, Shield, Globe2, Laptop2, CircuitBoard, Atom } from "lucide-react";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useSpring(useTransform(mouseY, [0, window.innerHeight], [10, -10]));
  const rotateY = useSpring(useTransform(mouseX, [0, window.innerWidth], [-10, 10]));
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Innovation Constante",
      description: "Technologies de pointe pour une gestion optimale",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Atom className="w-8 h-8" />,
      title: "IA Intelligente",
      description: "Prédictions et analyses automatisées",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: <CircuitBoard className="w-8 h-8" />,
      title: "Automatisation",
      description: "Processus automatisés pour plus d'efficacité",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Performance",
      description: "Maximisez vos revenus locatifs",
      color: "from-amber-400 to-orange-500",
    },
  ];

  const floatingIcons = [
    { Icon: Globe2, delay: 0 },
    { Icon: Laptop2, delay: 0.2 },
    { Icon: LineChart, delay: 0.4 },
    { Icon: Shield, delay: 0.6 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background with Interactive Grid */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px)] bg-[size:40px] bg-[position:center]" 
             style={{ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:40px] bg-[position:center]"
             style={{ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }} />
      </div>

      {/* Hero Section */}
      <div ref={targetRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative container px-4 mx-auto text-center z-10">
          <motion.div
            style={{ opacity, scale, y }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-lg blur-xl"
            />
            <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
              <span className="inline-block bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
                Révolutionnez
              </span>{" "}
              <br />
              votre Gestion Locative
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto"
          >
            Propulsez votre activité vers le futur avec notre plateforme révolutionnaire
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="relative group overflow-hidden bg-primary/80 hover:bg-primary/90 text-white transition-all duration-300"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  scale: 1.5,
                  rotate: 45,
                }}
              />
              <span className="relative">Commencer Gratuitement</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/login')}
              className="border-gray-500 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Se Connecter
            </Button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        {floatingIcons.map(({ Icon, delay }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
            className="absolute hidden md:block"
            style={{
              top: `${20 + index * 20}%`,
              left: `${10 + index * 25}%`,
              color: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <Icon className="w-12 h-12" />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        >
          <ArrowDown className="w-6 h-6 text-white animate-bounce" />
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative py-24 bg-black/50 backdrop-blur-xl">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="relative p-6 rounded-2xl overflow-hidden group backdrop-blur-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 mb-4 text-white"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="relative z-10 text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="relative z-10 text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}