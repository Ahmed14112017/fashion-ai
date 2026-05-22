import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { productName, type, colors, sizes, price } = await req.json();

    const prompt = `
أنت خبير تسويق متخصص في متاجر الملابس المصرية على Instagram.

المنتج: ${productName}
النوع: ${type}
الألوان المتاحة: ${colors}
المقاسات المتاحة: ${sizes}
السعر: ${price} جنيه

اكتب بالظبط:

**الوصف:**
[وصف بالعامية المصرية جذاب ومحمس - 3 جمل بس]

**الكابشن:**
[كابشن جاهز للنشر على Instagram بالعامية]

**الهاشتاقات:**
[10 هاشتاقات مناسبة بالعربي والإنجليزي]
    `;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content;
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Groq error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
