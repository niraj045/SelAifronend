import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export const ScrollReveal = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
                duration: 0.8, 
                delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const ScrollRevealText = ({ text, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.8 });
    
    const words = text.split(" ");
    
    return (
        <motion.div ref={ref} className={className}>
            {words.map((word, idx) => (
                <motion.span
                    key={idx}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                        duration: 0.5, 
                        delay: delay + (idx * 0.03),
                        ease: "easeOut"
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export const MagneticButton = ({ children, className = "", ...props }) => {
    const ref = useRef(null);
    
    const handleMouseMove = (e) => {
        const button = ref.current;
        if (!button) return;
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };
    
    const handleMouseLeave = () => {
        const button = ref.current;
        if (!button) return;
        button.style.transform = `translate(0px, 0px)`;
    };
    
    return (
        <motion.button
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
            {...props}
        >
            {children}
        </motion.button>
    );
};
