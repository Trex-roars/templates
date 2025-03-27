'use client'
import Button from '@/components/Button';
import { motion } from 'motion/react';

const page = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex h-screen w-full  items-center justify-center relative overflow-hidden"
        >

            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 2px, transparent 0)',
                    backgroundSize: '20px 20px',
                }}
                animate={{
                    backgroundPosition: ["0% 0%", "10% 10%", "5% 15%", "15% 5%", "0% 0%"],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "circInOut",
                }}
            />

            <Button />
        </motion.div>
    )
}

export default page
