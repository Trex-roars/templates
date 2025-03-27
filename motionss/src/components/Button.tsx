'use client'

import { motion } from "framer-motion";
import React from 'react';

const Button: React.FC = () => {
    return (

        <motion.button
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative text-pink-300 px-14 py-4 rounded-xl
          border border-pink-400/30
          bg-black
          shadow-xl
          transition-all duration-300
          transform
          z-[50]
          hover:text-white
          focus:outline-none"
        >

            {/* Button Text */}
            <span className="relative z-10 font-semibold tracking-wider">
                Great Babe
            </span>

            {/* Smooth Underline Animation */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent origin-left"
            />
        </motion.button>
    );
};

export default Button;
