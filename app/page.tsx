"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    productName: "",
    type: "",
    colors: "",
    sizes: "",
    price: "",
  });
  const [result, setResult] = useState<{
    desc: string;
    caption: string;
    hashtags: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function generate() {
    if (!form.productName.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    const text = data.result || "";

    const descMatch = text.match(
      /\*\*الوصف:\*\*\s*([\s\S]*?)(?=\*\*الكابشن:|$)/,
    );
    const captionMatch = text.match(
      /\*\*الكابشن:\*\*\s*([\s\S]*?)(?=\*\*الهاشتاقات:|$)/,
    );
    const hashtagsMatch = text.match(/\*\*الهاشتاقات:\*\*\s*([\s\S]*?)$/);
    const hashtags = hashtagsMatch
      ? hashtagsMatch[1]
          .trim()
          .split(/\s+/)
          .filter((t: string) => t.startsWith("#"))
      : [];

    setResult({
      desc: descMatch ? descMatch[1].trim() : text,
      caption: captionMatch ? captionMatch[1].trim() : "",
      hashtags,
    });
    setLoading(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium mb-1">
          كتابة محتوى Instagram بالـ AI
        </h1>
        <p className="text-gray-500 text-sm">
          وصف + كابشن + هاشتاقات لمتجرك في ثانية
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            {
              name: "productName",
              placeholder: "اسم المنتج — مثال: فستان صيفي",
              label: "اسم المنتج",
            },
            { name: "type", placeholder: "مثال: فستان، جاكيت", label: "النوع" },
            {
              name: "colors",
              placeholder: "مثال: أبيض، أسود، بيج",
              label: "الألوان",
            },
            {
              name: "sizes",
              placeholder: "مثال: S, M, L, XL",
              label: "المقاسات",
            },
          ].map((f) => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">{f.label}</label>
              <input
                className="border rounded-lg p-2 text-sm"
                name={f.name}
                placeholder={f.placeholder}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-xs text-gray-500">السعر بالجنيه</label>
          <input
            className="border rounded-lg p-2 text-sm"
            name="price"
            placeholder="مثال: 350"
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          onClick={generate}
        >
          {loading ? "بيكتب..." : "اكتب الكابشن والوصف"}
        </button>
      </div>

      {result && (
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
          {[
            { label: "الوصف", text: result.desc },
            { label: "الكابشن", text: result.caption },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                {s.label}
              </p>
              <p className="text-sm leading-relaxed text-right" dir="rtl">
                {s.text}
              </p>
              <button
                className="mt-2 text-xs border border-gray-200 rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
                onClick={() => copy(s.text)}
              >
                نسخ
              </button>
            </div>
          ))}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">الهاشتاقات</p>
            <div className="flex flex-wrap gap-2" dir="rtl">
              {result.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              className="mt-2 text-xs border border-gray-200 rounded-md px-3 py-1 text-gray-500 hover:bg-gray-100"
              onClick={() => copy(result.hashtags.join(" "))}
            >
              نسخ
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
