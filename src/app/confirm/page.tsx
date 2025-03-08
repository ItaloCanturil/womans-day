import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Confirm() {
  const router = useRouter();
  const { page_id } = router.query;
  const [fullUrl, setFullUrl] = useState('');
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    if (page_id) {
      const url = `${window.location.origin}/page/${page_id}`;
      setFullUrl(url);
    }
  }, [page_id]);

  const handleCopiar = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        setCopy(true);
        setTimeout(() => setCopy(false), 2000);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <QRCodeSVG
          value={`${window.location.origin}/page/${page_id}`}
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      <Input value={fullUrl} readOnly/>

      <Button
        onClick={handleCopiar}
        disabled={copy}
        className=""
      >
        {copy ? 'Copiado!' : 'Copiar Link'}
      </Button>
    </div>
  )
}