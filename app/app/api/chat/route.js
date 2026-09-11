export async function POST(request) {
  const { messages } = await request.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: "OPENROUTER_API_KEY sozlanmagan. Vercel'da Environment Variables bo'limiga qo'shing." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data.error?.message || "OpenRouter xatosi yuz berdi." },
        { status: res.status }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "";
    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: "Serverga ulanishda xatolik: " + err.message }, { status: 500 });
  }
        }
