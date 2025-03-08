"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <h1>
        Toda mulher merece ser celebrada. Faça a sua homenagem!
      </h1>

      <Button type="button" onClick={() => router.push('/create')}>Crie sua homenagem</Button>
    </div>
  )
}