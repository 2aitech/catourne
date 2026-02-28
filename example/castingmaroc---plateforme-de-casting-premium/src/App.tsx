import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  User, 
  Calendar, 
  Briefcase, 
  ChevronDown, 
  Star, 
  Camera, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Sun,
  Globe
} from 'lucide-react';
import { CardStack, CardStackItem } from '@/src/components/ui/card-stack';
import RadialOrbitalTimeline from '@/src/components/ui/radial-orbital-timeline';
import { FeatureShowcase, type TabMedia } from '@/src/components/ui/feature-showcase';

// --- Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline' | 'ghost' | 'charcoal'; 
  className?: string;
  [key: string]: any;
}) => {
  const variants = {
    primary: 'bg-gold text-white hover:bg-opacity-90 shadow-md',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-white',
    ghost: 'text-white hover:bg-white/10',
    charcoal: 'bg-charcoal text-white hover:bg-opacity-90 shadow-md',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const CastingCard = (props: { 
  title: string; 
  production: string; 
  location: string; 
  date: string; 
  category: string; 
  image: string;
  key?: any;
}) => {
  const { title, production, location, date, category, image } = props;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl hover:shadow-gold/10 transition-all duration-300 border border-white/10"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="gold-gradient text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold mb-1 text-white">{title}</h3>
        <p className="text-sm text-white/40 mb-4 font-medium">{production}</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MapPin size={16} className="text-gold" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar size={16} className="text-gold" />
            <span>{date}</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full py-2 text-[10px] uppercase tracking-widest font-bold border-white/20 text-white hover:border-gold">
          Voir les détails
        </Button>
      </div>
    </motion.div>
  );
};



// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-charcoal/95 backdrop-blur-md py-3 shadow-2xl border-b border-white/5' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://api.dicebear.com/7.x/initials/svg?seed=CT&backgroundColor=C28E4C&textColor=ffffff" 
            alt="CATOURNE Logo" 
            className="w-10 h-10 rounded-xl shadow-lg shadow-gold/20"
            referrerPolicy="no-referrer"
          />
          <span className="text-2xl font-bold tracking-tighter text-white">
            <span className="text-gold">CAT</span>OURNE
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-sm font-medium hover:text-gold transition-colors text-white/80">Castings</a>
          <a href="#" className="text-sm font-medium hover:text-gold transition-colors text-white/80">Talents</a>
          <a href="#" className="text-sm font-medium hover:text-gold transition-colors text-white/80">Recruteurs</a>
          <a href="#" className="text-sm font-medium hover:text-gold transition-colors text-white/80">A propos</a>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 border-r border-white/10 pr-8">
            <button className="text-white/60 hover:text-gold transition-colors">
              <Sun size={20} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer group">
              <Globe size={20} className="text-white/60 group-hover:text-gold transition-colors" />
              <span className="text-sm font-bold text-white/80 group-hover:text-gold transition-colors">FR</span>
              <ChevronDown size={14} className="text-white/40" />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-gold transition-colors text-white">Connexion</a>
            <Button variant="primary" className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg gold-gradient border-none shadow-lg shadow-gold/20">
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1547127796-06bb04e4b315?auto=format&fit=crop&q=80&w=2000" 
        alt="Ouarzazate Cinematic Desert" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/80" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block text-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
          Plateforme de Casting
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
          Le talent rencontre <br /> <span className="italic text-gold">l'opportunite</span>
        </h1>
        <h2 className="sr-only">CastingMaroc - La référence du casting au Maroc</h2>
        <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          Connectez performeurs talentueux et producteurs ambitieux. La reference du casting au Maroc.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button variant="primary" className="w-full sm:w-auto px-10 py-4 text-[10px] font-bold uppercase tracking-widest rounded-sm">
            Je suis performeur
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto px-10 py-4 text-[10px] font-bold uppercase tracking-widest border border-white/20 rounded-sm">
            Je suis recruteur
          </Button>
        </div>

        {/* Search Filter UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-morphism p-2 rounded-2xl md:rounded-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
            <Search className="text-gold" size={20} />
            <input 
              type="text" 
              placeholder="Role, casting or keyword" 
              className="bg-transparent border-none outline-none text-white placeholder:text-white/50 w-full text-sm font-medium"
            />
          </div>
          <div className="h-8 w-[1px] bg-white/20 hidden md:block" />
          <div className="flex-1 flex items-center justify-between px-6 py-3 w-full cursor-pointer group">
            <div className="flex items-center gap-3">
              <MapPin className="text-gold" size={20} />
              <span className="text-white/80 text-sm font-medium">Location</span>
            </div>
            <ChevronDown className="text-white/40 group-hover:text-gold transition-colors" size={16} />
          </div>
          <div className="h-8 w-[1px] bg-white/20 hidden md:block" />
          <div className="flex-1 flex items-center justify-between px-6 py-3 w-full cursor-pointer group">
            <div className="flex items-center gap-3">
              <User className="text-gold" size={20} />
              <span className="text-white/80 text-sm font-medium">Category</span>
            </div>
            <ChevronDown className="text-white/40 group-hover:text-gold transition-colors" size={16} />
          </div>
          <Button variant="primary" className="w-full md:w-auto px-10 py-4">
            Search
          </Button>
        </motion.div>
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <motion.div 
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-widest font-bold">Explore</span>
      <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
    </motion.div>
  </section>
);

const CastingGrid = () => {
  const [activeCategory, setActiveCategory] = useState('Toutes les offres');
  
  const categories = [
    "Longs Métrages",
    "Séries TV",
    "Publicités",
    "Mannequinat",
    "Voix-off",
    "UGC",
    "Équipe Technique",
    "Théâtre",
    "Toutes les offres"
  ];

  const castings = [
    {
      id: 1,
      title: "Lead Actor - Historical Drama",
      description: "Atlas Studios Production • Ouarzazate • March 15 - April 20",
      imageSrc: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
      href: "#",
    },
    {
      id: 2,
      title: "Background Extras - Desert Scene",
      description: "Global Film Services • Merzouga Dunes • April 05 - April 10",
      imageSrc: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      href: "#",
    },
    {
      id: 3,
      title: "Commercial Model - Luxury Resort",
      description: "Kasbah Media Group • Skoura Palm Grove • May 12 - May 14",
      imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      href: "#",
    },
    {
      id: 4,
      title: "Stunt Performer - Action Sequence",
      description: "Desert Storm Studios • Aït Benhaddou • June 01 - June 15",
      imageSrc: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
      href: "#",
    },
    {
      id: 5,
      title: "Voice Artist - Documentary",
      description: "Heritage Films Morocco • Remote / Ouarzazate • Ongoing",
      imageSrc: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
      href: "#",
    },
    {
      id: 6,
      title: "Child Actor - Local Feature",
      description: "Tafilalet Cinema • Errachidia • July 20 - August 05",
      imageSrc: "https://images.unsplash.com/photo-1503917988258-f19772f42ee6?auto=format&fit=crop&q=80&w=800",
      href: "#",
    }
  ];

  return (
    <section className="py-24 bg-charcoal relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none sand-texture" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="flex flex-col items-center justify-center mb-12 gap-6">
          <div className="max-w-3xl">
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Opportunités infinies, candidatures illimitées</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
              Explorez des <span className="text-gold italic">milliers</span> d'offres
            </h2>
            <p className="text-white/60 mx-auto max-w-xl">Découvrez les dernières opportunités des meilleures productions filmant dans la région Drâa-Tafilalet.</p>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-nowrap items-center justify-start md:justify-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
                activeCategory === cat 
                  ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckCircle size={14} className={activeCategory === cat ? 'opacity-100' : 'opacity-20'} />
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-12">
          <CardStack
            items={castings}
            initialIndex={0}
            autoAdvance
            intervalMs={3000}
            pauseOnHover
            showDots
            cardWidth={600}
            cardHeight={400}
          />
          
          <Button variant="outline" className="group border-white/20 text-white hover:border-gold px-12 py-4">
            Voir tous les castings <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const WhyCatourne = () => {
  const tabs: TabMedia[] = [
    {
      value: "cinema",
      label: "Cinéma",
      src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
      alt: "Cinéma",
    },
    {
      value: "pub",
      label: "Publicité",
      src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1000",
      alt: "Publicité",
    },
    {
      value: "mode",
      label: "Mode",
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
      alt: "Mode",
    },
  ];

  return (
    <FeatureShowcase
      className="bg-[#0a0a0a] border-t border-white/5"
      eyebrow="Pourquoi nous ?"
      title={<>Pourquoi <span className="text-gold italic">CATOURNE</span> ?</>}
      description="Nous redéfinissons le casting au Maroc en connectant les meilleurs talents avec les productions les plus prestigieuses."
      stats={["+1000 Castings", "Matching IA", "Profil Premium"]}
      steps={[
        {
          id: "step-1",
          title: "Réseau Premium",
          text: "Accédez à des directeurs de casting et des producteurs vérifiés. Fini les intermédiaires douteux.",
        },
        {
          id: "step-2",
          title: "Matching Intelligent",
          text: "Notre IA analyse votre profil et vous propose uniquement les rôles qui vous correspondent vraiment.",
        },
        {
          id: "step-3",
          title: "Visibilité Maximale",
          text: "Votre portfolio est optimisé pour être mis en avant auprès des décideurs du secteur au bon moment.",
        },
      ]}
      tabs={tabs}
      defaultTab="cinema"
      panelMinHeight={600}
    />
  );
};

const HowItWorks = () => {
  const timelineData = [
    {
      id: 1,
      title: "Profil",
      date: "Étape 1",
      content: "Créez un portfolio professionnel. Ajoutez vos meilleures photos, vos bandes-démo et mettez en avant vos talents uniques.",
      category: "Profil",
      icon: Camera,
      relatedIds: [2],
      status: "completed" as const,
      energy: 100,
    },
    {
      id: 2,
      title: "Matching",
      date: "Étape 2",
      content: "Notre moteur intelligent analyse les rôles et vous recommande les opportunités parfaites pour votre profil.",
      category: "Matching",
      icon: Zap,
      relatedIds: [1, 3],
      status: "in-progress" as const,
      energy: 85,
    },
    {
      id: 3,
      title: "Candidature",
      date: "Étape 3",
      content: "Un processus de candidature rapide et simple. Plus de formulaires compliqués ou d'e-mails interminables.",
      category: "Candidature",
      icon: CheckCircle,
      relatedIds: [2, 4],
      status: "pending" as const,
      energy: 60,
    },
    {
      id: 4,
      title: "Succès",
      date: "Étape 4",
      content: "Votre profil est visible par des producteurs et directeurs de casting vérifiés à la recherche de talents locaux.",
      category: "Succès",
      icon: Star,
      relatedIds: [3],
      status: "pending" as const,
      energy: 40,
    },
  ];

  return (
    <section className="py-32 bg-[#0a0a0a] overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-bold uppercase tracking-[0.2em] text-sm mb-4 block"
          >
            Le Parcours du Talent
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-white mb-6"
          >
            Comment CastingMaroc fonctionne
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-gold mx-auto rounded-full" 
          />
        </div>

        <div className="relative h-[600px]">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
        
        {/* Final Navigation Prompt */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button 
            variant="primary" 
            className="gold-gradient px-12 py-4 rounded-full text-lg shadow-xl hover:scale-105 transition-transform"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Commencez votre voyage
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const RegionHighlight = () => (
  <section className="relative py-32 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1539129938914-f299e2996417?auto=format&fit=crop&q=80&w=2000" 
        alt="Kasbah Aït Benhaddou" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px]" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
      <div className="flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Focus Régional</span>
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-8 leading-tight">Pourquoi Drâa-Tafilalet ?</h2>
          <p className="text-xl text-white/80 mb-10 font-light leading-relaxed italic">
            "Le Hollywood du Maroc — terre de cinéma, de patrimoine et de talents créatifs."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gold" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Kasbah Aït Benhaddou</h4>
                <p className="text-white/60 text-sm">Site classé au patrimoine mondial de l'UNESCO et décor de films légendaires.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gold" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Studios Atlas</h4>
                <p className="text-white/60 text-sm">L'un des plus grands studios de cinéma au monde par sa superficie.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gold" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Paysages Infinis</h4>
                <p className="text-white/60 text-sm">Des montagnes enneigées aux déserts vastes et oasis luxuriantes.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          <img src="https://images.unsplash.com/photo-1547127796-06bb04e4b315?auto=format&fit=crop&q=80&w=600" className="rounded-2xl h-64 w-full object-cover shadow-2xl" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=600" className="rounded-2xl h-64 w-full object-cover shadow-2xl" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=600" className="rounded-2xl h-64 w-full object-cover shadow-2xl" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1516663243149-349377402037?auto=format&fit=crop&q=80&w=600" className="rounded-2xl h-64 w-full object-cover shadow-2xl" referrerPolicy="no-referrer" />
        </motion.div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-32 bg-charcoal relative overflow-hidden border-t border-white/5">
    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none sand-texture" />
    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">Commencez votre voyage aujourd'hui.</h2>
        <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
          Rejoignez la communauté de milliers de talents et de recruteurs qui façonnent l'avenir du cinéma au Maroc.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" className="w-full sm:w-auto px-12 py-5 text-[10px] font-bold uppercase tracking-widest rounded-sm">
            Créer un profil Talent
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto px-12 py-5 text-[10px] font-bold uppercase tracking-widest border border-white/20 rounded-sm">
            Publier un Casting
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-charcoal text-white/60 py-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img 
              src="https://api.dicebear.com/7.x/initials/svg?seed=CT&backgroundColor=C28E4C&textColor=ffffff" 
              alt="CATOURNE Logo" 
              className="w-10 h-10 rounded-xl shadow-lg shadow-gold/20"
              referrerPolicy="no-referrer"
            />
            <span className="text-2xl font-bold tracking-tighter text-white">
              <span className="text-gold">CAT</span>OURNE
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            La première plateforme de casting pour la région Drâa-Tafilalet. Connecter les talents locaux aux productions mondiales.
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <h4 className="text-white font-bold mb-6">Plateforme</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-gold transition-colors">Parcourir les Castings</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Annuaire des Talents</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Histoires de Succès</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Tarifs</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-white font-bold mb-6">Ressources</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-gold transition-colors">Conseils de Casting</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Guide du Portfolio</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Guide des Studios</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Centre d'Aide</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-white font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li>Email: contact@castingmaroc.ma</li>
            <li>Tél: +212 524 88 00 00</li>
            <li>Lieu: Ouarzazate, Maroc</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-4 text-xs uppercase tracking-widest font-bold">
        <p>© 2024 CastingMaroc. Tous droits réservés.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-gold transition-colors">Politique de Confidentialité</a>
          <a href="#" className="hover:text-gold transition-colors">Conditions d'Utilisation</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[72px]">
        <Hero />
        <CastingGrid />
        <WhyCatourne />
        <HowItWorks />
        <RegionHighlight />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
