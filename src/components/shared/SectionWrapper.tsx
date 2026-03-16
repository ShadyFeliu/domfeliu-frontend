'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  fullHeight?: boolean;
}

export default function SectionWrapper({ 
  children, 
  id, 
  className = '',
  fullHeight = false 
}: SectionWrapperProps) {
  return (
    <section 
      id={id} 
      className={`relative w-full ${fullHeight ? 'min-h-screen flex items-center' : 'py-20 md:py-32'} overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
