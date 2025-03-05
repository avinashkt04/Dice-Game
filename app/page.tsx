'use client'

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <motion.div
      className="px-2 flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to the Game
      </motion.h1>

      <motion.p
        className="text-lg text-gray-400 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Try your luck and win big!
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Link href="/game">
          <motion.button
            className="px-6 py-3 bg-teal-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-teal-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Play Now
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
