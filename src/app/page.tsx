"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRef, useEffect } from "react";
import {
  ArrowDown,
  LineChart,
  Rocket,
  Star,
  Shield,
  Globe2,
  Laptop2,
  CircuitBoard,
  Atom,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Footer from "../components/footer";

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
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useSpring(
    useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 0], [10, -10])
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-10, 10])
  );
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Innovation Constante",
      description: "Technologies de pointe pour une gestion optimale",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: <Atom className="w-8 h-8" />,
      title: "IA Intelligente",
      description: "Prédictions et analyses automatisées",
      color: "from-fuchsia-500 to-violet-600",
    },
    {
      icon: <CircuitBoard className="w-8 h-8" />,
      title: "Automatisation",
      description: "Processus automatisés pour plus d'efficacité",
      color: "from-teal-400 to-emerald-600",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Performance",
      description: "Maximisez vos revenus locatifs",
      color: "from-indigo-400 to-blue-600",
    },
  ];

  const floatingIcons = [
    { Icon: Globe2, delay: 0, rotate: 20 },
    { Icon: Laptop2, delay: 0.2, rotate: -15 },
    { Icon: LineChart, delay: 0.4, rotate: 10 },
    { Icon: Shield, delay: 0.6, rotate: -20 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background with Interactive Grid */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_100%)]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px)] bg-[size:30px] bg-[position:center]"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:30px] bg-[position:center]"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        />
      </div>

      {/* Section héro */}
      <div
        ref={targetRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        id="hero"
      >
        {/* Contenu principal de la section héro */}
        <div className="relative container px-4 mx-auto text-center z-10">
          <motion.div style={{ opacity, scale, y }} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 rounded-lg blur-xl"
            />
            <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 glitch-text">
              <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-transparent bg-clip-text">
                Révolutionnez
              </span>{" "}
              <br />
              votre Gestion Locative
            </h1>
          </motion.div>

          {/* Description de la plateforme */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto"
          >
            Propulsez votre activité vers le futur avec notre plateforme
            révolutionnaire
          </motion.p>

          {/* Bouton pour commencer gratuitement et se connecter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="relative group overflow-hidden bg-primary/80 hover:bg-primary/90 text-white transition-all duration-300"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  scale: 1.5,
                  rotate: 45,
                }}
              />
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/signup")}
                className="border-white bg-white text-black hover:bg-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                Commencer Gratuitement
              </Button>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="border-gray-500 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              Se Connecter
            </Button>
          </motion.div>
        </div>

        {/* Éléments flottants pour la présentation de la plateforme */}
        {floatingIcons.map(({ Icon, delay, rotate }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
              rotate: [0, rotate, 0],
            }}
            transition={{
              duration: 3,
              delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute hidden md:block"
            style={{
              top: `${20 + index * 20}%`,
              left: `${10 + index * 25}%`,
              color: "rgba(56, 189, 248, 0.3)",
            }}
          >
            <Icon className="w-12 h-12" />
          </motion.div>
        ))}

        {/* Bouton pour scroller vers les fonctionnalités */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        >
          <div
            onClick={() => {
              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="cursor-pointer"
          >
            <ArrowDown className="w-6 h-6 text-white animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Fonctionnalités principales et objectifs de la plateforme */}
      <div
        id="features"
        className="relative py-24 bg-black/50 backdrop-blur-xl"
      >
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="relative p-6 rounded-2xl overflow-hidden group backdrop-blur-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                />
                  {feature.icon}
                <h3 className="relative z-10 text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section des fonctionnalités du dashboard */}
      <div className="relative py-24 bg-black/50 backdrop-blur-xl" id="dashboard">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-transparent bg-clip-text">
                Votre Dashboard Complet
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Une suite d'outils puissants pour gérer votre activité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                🏠 Gestion des Biens
              </h3>
              <p className="text-gray-400">
                Gérez vos propriétés, suivez leur état et optimisez leur
                rentabilité
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-violet-600/10 backdrop-blur-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                👥 Gestion des Clients
              </h3>
              <p className="text-gray-400">
                Suivez vos locataires, leurs contrats et leurs informations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-teal-400/10 to-emerald-600/10 backdrop-blur-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                📅 Réservations
              </h3>
              <p className="text-gray-400">
                Gérez les locations et le planning de vos biens
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-400/10 to-blue-600/10 backdrop-blur-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                💰 Paiements
              </h3>
              <p className="text-gray-400">
                Suivez vos revenus et gérez les paiements des loyers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                📊 Rapports
              </h3>
              <p className="text-gray-400">
                Analysez vos performances et générez des rapports détaillés
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-600/10 backdrop-blur-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                ⚙️ Paramètres
              </h3>
              <p className="text-gray-400">
                Personnalisez votre expérience et configurez vos préférences
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact par mail */}
      <div className="relative py-24 bg-black/50 backdrop-blur-xl" id="contact">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 text-transparent bg-clip-text">
                Contactez-nous
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Une question ou un projet ? Écrivez-nous
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-gray-800"
          >
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-white mb-2 block">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 rounded-md bg-white/5 border border-primary/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="text-white mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 rounded-md bg-white/5 border border-primary/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-white mb-2 block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full p-3 rounded-md bg-white/5 border border-primary/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Votre message ici..."
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
              >
                Envoyer le message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      {/* Ajout du composant Footer */}
      <Footer />
    </div>
  );
}

const styles = `
.glitch-text {
  text-shadow: 
    0.05em 0 0 rgba(255,0,0,.75),
    -0.025em -0.05em 0 rgba(0,255,0,.75),
    0.025em 0.05em 0 rgba(0,0,255,.75);
  animation: glitch 500ms infinite;
}

@keyframes glitch {
  0% {
    text-shadow: 
      0.05em 0 0 rgba(255,0,0,.75),
      -0.05em -0.025em 0 rgba(0,255,0,.75),
      -0.025em 0.05em 0 rgba(0,0,255,.75);
  }
  14% {
    text-shadow: 
      0.05em 0 0 rgba(255,0,0,.75),
      -0.05em -0.025em 0 rgba(0,255,0,.75),
      -0.025em 0.05em 0 rgba(0,0,255,.75);
  }
  15% {
    text-shadow: 
      -0.05em -0.025em 0 rgba(255,0,0,.75),
      0.025em 0.025em 0 rgba(0,255,0,.75),
      -0.05em -0.05em 0 rgba(0,0,255,.75);
  }
  49% {
    text-shadow: 
      -0.05em -0.025em 0 rgba(255,0,0,.75),
      0.025em 0.025em 0 rgba(0,255,0,.75),
      -0.05em -0.05em 0 rgba(0,0,255,.75);
  }
  50% {
    text-shadow: 
      0.025em 0.05em 0 rgba(255,0,0,.75),
      0.05em 0 0 rgba(0,255,0,.75),
      0 -0.05em 0 rgba(0,0,255,.75);
  }
  99% {
    text-shadow: 
      0.025em 0.05em 0 rgba(255,0,0,.75),
      0.05em 0 0 rgba(0,255,0,.75),
      0 -0.05em 0 rgba(0,0,255,.75);
  }
  100% {
    text-shadow: 
      -0.025em 0 0 rgba(255,0,0,.75),
      -0.025em -0.025em 0 rgba(0,255,0,.75),
      -0.025em -0.05em 0 rgba(0,0,255,.75);
  }
}
`;
