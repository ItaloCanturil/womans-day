"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Confirm() {
  const searchParams = useSearchParams();
  const page_id = searchParams.get('page_id'); // Obtém o parâmetro da URL
  console.log("🚀 ~ Confirm ~ page_id:", page_id)
  const [fullUrl, setFullUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (page_id) {
      const url = `${window.location.origin}/${page_id}`;
      setFullUrl(url);
      console.log("🚀 ~ useEffect ~ url:", url)
    }
  }, [page_id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1>Seu QR code é esse:</h1>

      <div className="p-4 bg-white rounded-lg shadow-md">
        <QRCodeSVG
          value={fullUrl}
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      {/* Input e Botão */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <Input
          value={fullUrl}
          readOnly
          className="text-center font-mono"
        />
        <Button
          onClick={handleCopy}
          disabled={copied}
          className="w-full"
          variant={copied ? 'secondary' : 'default'}
        >
          {copied ? 'Copiado!' : 'Copiar Link'}
        </Button>
      </div>
    </div>
  )
}