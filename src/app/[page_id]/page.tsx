import { supabase } from "@/db/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HeartRain from "./components/heart-rain";
import { AnimatedText } from "./components/animated-text";

type PageParams = Promise<{page_id: string}>;

async function getData(page_id: string) {
  const { data, error } = await supabase
    .from('tributes')
    .select('*')
    .eq('page_id', page_id)
    .single();

  if (error) return notFound();
  return data;
}

export async function generateMetadata( params: { params: PageParams}): Promise<Metadata> {
   
  const { page_id } = await params.params;

  const data = await getData(page_id);
  
  return {
    title: `Homenagem para ${data.women_name}`,
    openGraph: {
      title: `Homenagem para ${data.women_name}`,
      images: [data.photo_urls[0]],
    },
  }
}

export default async function Page(params: { params: PageParams}) {
  const { page_id } = await params.params;

  const data = await getData(page_id);
  return (
    <>
      <HeartRain />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <AnimatedText data={data}/>
      </main>
    </>
  );
}