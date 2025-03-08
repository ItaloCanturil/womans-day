import Message from "./components/message";
import ScratchCard from "./components/scratch-card";
import { supabase } from "@/db/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HeartRain from "./components/heart-rain";

async function getData(page_id: string) {
  const { data, error } = await supabase
    .from('tributes')
    .select('*')
    .eq('page_id', page_id)
    .single();

  if (error) return notFound();
  return data;
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.page_id);
  
  return {
    title: `Homenagem para ${data.women_name}`,
    openGraph: {
      title: `Homenagem para ${data.women_name}`,
      images: [data.photo_urls[0]],
    },
  }
}

export default async function Page({ params }) {
  const data = await getData(params.page_id);

  return (
    <>
      <HeartRain />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Message message={data.message} />
        <ScratchCard
          imageUrl={data.photo_urls[0]}
          brushSize={10}
          height={500}
          width={300}
        />
      </main>
    </>
  );
}