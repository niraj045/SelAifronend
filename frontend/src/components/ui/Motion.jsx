import { motion } from "framer-motion";

// A card that floats up when it appears
export const FadeInCard = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// A button with a satisfying "tap" scale effect
export const BouncyButton = ({ children, onClick, className, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${className}`}
  >
    {children}
  </motion.button>
);
