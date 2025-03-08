// app/[page_id]/components/heart-rain.tsx
"use client";

import { useEffect } from "react";

export default function HeartRain() {
	useEffect(() => {
		const heartCount = 50;
		const body = document.body;
		const heartStyles = `
      @keyframes fall {
        0% { transform: translateY(-10%); opacity: 0; }
        100% { transform: translateY(100vh); opacity: 1; }
      }
      .heart {
        position: fixed;
        font-size: 20px;
        color: #ff6b6b;
        animation: fall 5s linear infinite;
        pointer-events: none;
      }
    `;

		// Cria estilo global
		const style = document.createElement("style");
		style.textContent = heartStyles;
		document.head.appendChild(style);

		// Cria corações
		const createHeart = () => {
			const heart = document.createElement("div");
			heart.className = "heart";
			heart.style.left = Math.random() * 100 + "vw";
			heart.style.animationDuration = Math.random() * 3 + 2 + "s";
			heart.textContent = "❤️";
			body.appendChild(heart);

			// Remove após animação
			setTimeout(() => heart.remove(), 5000);
		};

		// Gera chuva
		const interval = setInterval(createHeart, 200);
		return () => {
			clearInterval(interval);
			body.querySelectorAll(".heart").forEach((el) => el.remove());
		};
	}, []);

	return null;
}
