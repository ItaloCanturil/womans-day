"use client";

import { motion } from 'framer-motion';

type MessageProps = {
  message: string
}

const Message = ({ message }: MessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.3 }}
    className="message-container text-center"
  >
    <p className="">{message}</p>
  </motion.div>
)

export default Message;