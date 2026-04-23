'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, Users } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' },
  }),
};

const contactCards = [
  {
    icon: Users,
    title: 'Le Patriarche',
    subtitle: 'Chef de famille',
    lines: [
      { icon: Phone, text: '+33 6 00 00 00 00' },
      { icon: Mail, text: 'patriarche@famille.fr' },
      { icon: MapPin, text: 'Paris, France' },
    ],
  },
  {
    icon: Heart,
    title: 'La Famille',
    subtitle: 'Membres proches',
    lines: [
      { icon: Mail, text: 'famille@inmemorum.fr' },
      { icon: MapPin, text: 'Île-de-France' },
    ],
  },
];

export default function PublicContact() {
  return (
    <div className="min-h-screen bg-farewell-cream">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-farewell-gold/10" />
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-farewell-gold/10" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-8"
          >
            <div className="p-1.5 bg-farewell-gold/15 rounded-full">
              <div className="p-5 bg-white rounded-full shadow-md border border-farewell-stone">
                <Mail className="text-farewell-gold" size={36} strokeWidth={1.25} />
              </div>
            </div>
          </motion.div>

          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[10px] uppercase tracking-[0.4em] text-farewell-gold font-bold mb-4"
          >
            Famille &amp; Contact
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl md:text-6xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight text-balance mb-6"
          >
            Restons en lien
          </motion.h1>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-10 h-[1px] bg-farewell-gold/50 mx-auto mb-6"
          />

          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-md mx-auto"
          >
            &ldquo;Contactez les membres de la famille ou le patriarche.&rdquo;
          </motion.p>
        </div>
      </section>

      <FarewellSeparator />

      {/* Contact Cards */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactCards.map((card, i) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={card.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group bg-white border border-farewell-stone rounded-3xl p-10 shadow-sm hover:shadow-md hover:border-farewell-gold/30 transition-all duration-500"
              >
                {/* Card header */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="shrink-0 p-3 bg-farewell-cream rounded-2xl border border-farewell-stone group-hover:border-farewell-gold/30 transition-colors duration-300">
                    <CardIcon className="text-farewell-gold" size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-farewell-charcoal tracking-widest uppercase leading-tight">
                      {card.title}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-farewell-gold font-bold mt-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-farewell-stone mb-8" />

                {/* Contact lines */}
                <ul className="space-y-5">
                  {card.lines.map((line) => {
                    const LineIcon = line.icon;
                    return (
                      <li key={line.text} className="flex items-center gap-4">
                        <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-farewell-gold/10">
                          <LineIcon size={14} className="text-farewell-gold" strokeWidth={1.75} />
                        </div>
                        <span className="text-stone-600 font-serif text-base leading-relaxed">
                          {line.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Message Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-farewell-charcoal rounded-3xl p-10 md:p-14 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-farewell-gold/20 rounded-2xl">
                <Mail className="text-farewell-gold" size={28} strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-farewell-cream tracking-widest uppercase mb-3">
              Envoyer un message
            </h3>
            <div className="w-8 h-[1px] bg-farewell-gold/50 mx-auto mb-5" />
            <p className="text-stone-400 font-serif italic text-base leading-relaxed mb-8 max-w-sm mx-auto">
              Vous souhaitez nous contacter directement ? Écrivez-nous et nous vous répondrons dans les plus brefs délais.
            </p>
            <a
              href="mailto:famille@inmemorum.fr"
              className="inline-flex items-center gap-3 bg-farewell-gold text-farewell-cream text-[11px] uppercase tracking-[0.3em] font-bold px-8 py-4 rounded-full hover:bg-farewell-gold/90 transition-colors duration-300"
            >
              <Mail size={14} strokeWidth={2} />
              Écrire un message
            </a>
          </motion.div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-16" />
    </div>
  );
}
