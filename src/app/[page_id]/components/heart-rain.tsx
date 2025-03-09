"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type Hearts = {
	id: number,
	left: number,
	delay: number,
	duration: number,
	size: number,
}

const generateHearts = (count: number ): Hearts[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: i,
		left: Math.random() * 100,
		delay: Math.random() * 5,
		duration: Math.random() * 4 + 2,
		size: Math.random() * 30 + 10,
	}));
};

export default function HeartRain() {
	const [hearts, setHearts] = useState<Hearts[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			setHearts(generateHearts(20));
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
			{hearts.map((heart) => (
				<motion.div
					key={heart.id}
					initial={{ y: "-10vh", opacity: 0 }}
					animate={{ y: "100vh", opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: heart.duration,
						delay: heart.delay,
						ease: "easeIn",
						repeat: Infinity,
					}}
					className="absolute text-red-500"
					style={{
						left: `${heart.left}%`,
						fontSize: `${heart.size}px`,
					}}
				>
					<Heart width={heart.size} height={heart.size} className="text-red-500"></Heart>
				</motion.div>
			))}
		</div>
	)
}
