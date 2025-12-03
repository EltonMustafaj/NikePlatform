import { motion } from 'framer-motion'
import './LoadingSpinner.css'

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner-container">
            <motion.div
                className="nike-logo-spinner"
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    rotate: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    },
                    scale: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <img src="/images/logo.jpg" alt="Loading" />
            </motion.div>
            <motion.p
                className="loading-text"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Duke u ngarkuar...
            </motion.p>
        </div>
    )
}

export default LoadingSpinner
