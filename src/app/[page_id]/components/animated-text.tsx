"use client";

import { useEffect, useState } from "react";
import Message from "./message";
import ScratchCard from "./scratch-card";
import { motion } from "framer-motion";

type Data = {
  message: string,
  photo_urls: string[]
}

export function AnimatedText({ data }: { data: Data}) {
  const [showSecondComponent, setShowSecondComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondComponent(true);
    }, 1000); // Delay before showing the second component
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Animated Text */}
      <Message message={data.message} />

      {/* Second Component Appears After Text */}
      {showSecondComponent && (
        <motion.div
          className="mt-6 p-6 bg-white rounded-2xl shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ScratchCard
            imageUrl={data.photo_urls[0]}
            brushSize={10}
            height={500}
            width={300}
          />
        </motion.div>
      )}
    </div>
  );
}