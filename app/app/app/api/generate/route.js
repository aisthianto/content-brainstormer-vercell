export async function POST(request) {
  const { topik } = await request.json();

  if (!topik) {
    return Response.json({ error: 'Topik tidak boleh kosong.' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'Kunci AI belum dipasang. Hubungi admin.' },
      { status: 500 }
    );
  }

  const prompt = `Kamu adalah asisten kreatif untuk tim konten kantor. Berikan 5 ide konten singkat (masing-masing 1-2 kalimat) untuk topik berikut: "${topik}". Format: daftar bernomor. Bahasa Indonesia santai, langsung to the point, tanpa basa-basi.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b', // model gratis di Groq, cepat
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Groq error:', errText);
      return Response.json(
        { error: 'AI sedang sibuk atau kunci salah. Coba lagi nanti.' },
        { status: 502 }
      );
    }

    const data = await res.json();
    const ide = data.choices?.[0]?.message?.content;

    if (!ide) {
      return Response.json({ error: 'AI tidak mengembalikan ide.' }, { status: 502 });
    }

    return Response.json({ ide });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Gagal menghubungi AI.' }, { status: 500 });
  }
}