"use client";

import Image from "next/image";
import React, { useRef, useEffect,  useState } from "react";

interface ScratchCardProps {
  imageUrl: string;
  width?: number;
  height?: number;
  brushSize?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  imageUrl,
  width = 300,
  height = 300,
  brushSize = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "rgba(200, 200, 200, 0.9)";
    ctx.fillRect(0, 0, width, height);

    canvas.style.filter = "blur(1px)";

    const handleScratch = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const offsetX =
        "touches" in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
      const offsetY =
        "touches" in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, brushSize, 0, Math.PI * 2);
      ctx.fill();

      checkScratchCompletion(ctx);
    };

    const checkScratchCompletion = (ctx: CanvasRenderingContext2D) => {
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let clearedPixels = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] === 0) clearedPixels++;
      }

      const revealPercentage = (clearedPixels / (width * height)) * 100;
      if (revealPercentage > 60) setIsScratched(true);
    };

    canvas.addEventListener("mousedown", (e) => {
      handleScratch(e);
      canvas.addEventListener("mousemove", handleScratch);
    });

    canvas.addEventListener("mouseup", () => {
      canvas.removeEventListener("mousemove", handleScratch);
    });

    canvas.addEventListener("touchstart", handleScratch);
    canvas.addEventListener("touchmove", handleScratch);

    return () => {
      canvas.removeEventListener("mousedown", handleScratch);
      canvas.removeEventListener("mousemove", handleScratch);
      canvas.removeEventListener("mouseup", () => canvas.removeEventListener("mousemove", handleScratch));
      canvas.removeEventListener("touchstart", handleScratch);
      canvas.removeEventListener("touchmove", handleScratch);
    };
  }, [width, height, brushSize])

  return (
    <div className="relative" style={{ width, height }}>
      <Image src={imageUrl} alt="Hidden" className="absolute top-0 left-0 w-full h-full object-cover" width={width} height={height} />
      {!isScratched && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      )}
    </div>
  )
}

export default ScratchCard;