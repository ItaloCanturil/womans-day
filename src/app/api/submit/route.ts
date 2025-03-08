import { supabase } from "@/db/supabase";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { women_name, email, message, photo_urls } = body;

    let page_id: string;
    let isUnique = false;

    do {
      page_id = nanoid(6); // Gera ID de 10 caracteres
      const { data: existing } = await supabase
        .from('tributes')
        .select('page_id')
        .eq('page_id', page_id)
        .single();

      if (!existing) isUnique = true;
    } while (!isUnique);

    const { error } = await supabase
      .from('tributes')
      .insert({
        page_id,
        women_name,
        email,
        message,
        photo_urls
      });

    if (error) {
      console.error('Erro ao inserir no banco:', error);
      return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
    }

    // 4. Retornar sucesso com page_id
    return NextResponse.json({ success: true, page_id }, { status: 200 });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { women_name, email, message, photo_urls } = req.body;
//     console.log("🚀 ~ handler ~ req:", req)

//     const { data: { page_id }, error: idError } = await supabase
//       .rpc('generate_unique_page_id');

//     if (idError) return res.status(500).json({ error: idError.message });

//     const { error } = await supabase
//       .from('tributes')
//       .insert({
//         page_id,
//         women_name,
//         email,
//         message,
//         photo_urls
//       });
      
//     console.log("🚀 ~ handler ~ error:", error)
//     if (error) return res.status(500).json({ error: error.message });

//     res.status(200).json({ success: true, page_id });
//   }
// }