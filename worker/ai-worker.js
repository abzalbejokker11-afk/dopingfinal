// ═══════════════════════════════════════════════════════════════
// AI DORI TEKSHIRGICH WORKER — Cloudflare Workers AI (BEPUL)
// Joylash: Cloudflare Dashboard → Workers → Create → shu kodni qo'yish
// MUHIM: Settings → Bindings → "Workers AI" qo'shing, nomi: AI
// Hech qanday API kalit KERAK EMAS — Cloudflare o'zi beradi.
// ═══════════════════════════════════════════════════════════════

const WADA_2026_BILIM = `
WADA 2026 Taqiqlangan Ro'yxati — qisqacha:
HAR DOIM TAQIQLANGAN (musobaqada ham, tashqarisida ham):
- S0: Tasdiqlanmagan moddalar (klinik sinovdagi preparatlar)
- S1: Anabolik moddalar (testosteron, nandrolon, stanozolol, SARM: ostarine, ligandrol)
- S2: Peptid gormonlar, o'sish omillari (EPO, o'sish gormoni GH, IGF-1, insulin — faqat diabetiklarga TUE bilan)
- S3: Beta-2 agonistlar. ISTISNO: inhalyatsion salbutamol ≤1600 mkg/24soat (har 8 soatda ≤600 mkg), formoterol ≤54 mkg/24soat, salmeterol ≤200 mkg/24soat — bu dozalarda ruxsat, undan yuqorisi TUE talab qiladi. Oral/inyeksion shakli taqiqlangan.
- S4: Gormon va metabolik modulyatorlar (tamoksifen, klomifen, meldonium, insulin-mimetiklar, AICAR)
- S5: Diuretiklar va maskirovka vositalari (furosemid, gidroxlorotiazid, probenetsid)
- M1: Qon manipulyatsiyasi (qon quyish, EPO)
- M2: Kimyoviy/fizik manipulyatsiya (namunani almashtirish, IV infuziya >100ml/12soat tibbiy zaruratsiz)
- M3: Gen dopingi
FAQAT MUSOBAQA PAYTIDA TAQIQLANGAN:
- S6: Stimulyatorlar (amfetamin, kokain, efedrin >10mkg/ml, psevdoefedrin >150mkg/ml siydikda)
- S7: Narkotiklar (morfin, fentanil, tramadol; kodein past dozada monitoring)
- S8: Kannabinoidlar (marixuana, THC >150ng/ml; sof CBD taqiqlanmagan lekin mahsulotlarda THC aralashmasi xavfi bor)
- S9: Glyukokortikoidlar — oral, IV, IM, rektal yo'llar taqiqlangan (deksametazon, prednizolon). Teri kremi, ko'z/burun tomchisi, ingalyatsiya, bo'g'in ichiga inyeksiya — RUXSAT.
AYRIM SPORT TURLARIDA: P1 Beta-blokerlar (otishma, kamondan otish va h.k.)
MONITORING (taqiqlanmagan, kuzatuvda): kofein (siydikda 12 mkg/ml chegara ~ kuniga 4-5 stakan qahvadan oshmaslik)
RUXSAT ETILGAN keng tarqalganlar: paracetamol, ibuprofen, aspirin, antibiotiklar (amoksitsillin, azitromitsin), antigistaminlar (loratadin, tsetirizin), omeprazol, vitaminlar, kreatin monohidrat, melatonin, magniy, sink, omega-3, probiotiklar.
BAD/qo'shimchalar OGOHLANTIRISHI: sertifikatsiz BADlarning 12-25% ida taqiqlangan modda izlari topilgan — faqat Informed Sport / Kölner Liste sertifikatli mahsulot tavsiya qilinadi.
`;

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors)
  });
}

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ ok: false, error: 'Faqat POST' }, 405, cors);

    let body;
    try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'JSON xato' }, 400, cors); }

    const drug = String(body.drug || '').slice(0, 120).trim();
    const lang = body.lang === 'ru' ? 'ru' : 'uz';
    if (!drug) return json({ ok: false, error: "Dori nomi bo'sh" }, 400, cors);

    // ── KESH: bir xil so'rov ikkinchi marta AI ga bormaydi (tez + bepul) ──
    const cacheKey = new Request('https://ai-cache.local/' + lang + '/' + encodeURIComponent(drug.toLowerCase()));
    const cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) {
      const cached = await hit.text();
      return new Response(cached, { headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'HIT' }, cors) });
    }

    const tilKorsatma = lang === 'ru'
      ? 'Отвечай ТОЛЬКО на русском языке.'
      : "Javobni FAQAT o'zbek tilida (lotin alifbosida) yoz.";

    const system = `Sen WADA antidoping bo'yicha mutaxassis yordamchisan. Quyidagi rasmiy WADA 2026 ma'lumotiga QAT'IY tayanib javob berasan:
${WADA_2026_BILIM}
QOIDALAR:
1. ${tilKorsatma}
2. Aynan shu formatda javob ber (har qator yangi qatordan):
**DORI/MODDA:** [nomi]
**STATUS:** [Ruxsat etilgan / Taqiqlangan / Monitoring / TUE kerak / Ehtiyot bilan]
**WADA KATEGORIYA:** [S1..S9, M1-M3, P1 yoki "Ro'yxatda yo'q"]
**TUE KERAKMI:** [Ha/Yo'q + qisqa izoh]
**QISQA TUSHUNTIRISH:** [2-3 jumla]
**TAVSIYA:** [sportchi nima qilishi kerak]
3. Agar modda haqida aniq bilmasang — taxmin QILMA. "Aniq ma'lumot yo'q" deb yoz va Global DRO (globaldro.com) hamda shifokor bilan tekshirishni tavsiya qil.
4. Javob qisqa va aniq bo'lsin. Tibbiy maslahat emasligini, yakuniy qaror rasmiy manbalardan tekshirilishi kerakligini ohirida bir jumla bilan eslat.`;

    let text = '';
    try {
      const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: (lang === 'ru' ? 'Проверь препарат/вещество: ' : "Quyidagi dori/moddani tekshir: ") + '"' + drug + '"' }
        ],
        max_tokens: 700,
        temperature: 0.2
      });
      text = (ai && (ai.response || ai.result || '')) || '';
    } catch (e) {
      return json({ ok: false, error: 'AI xatosi: ' + (e.message || e) }, 502, cors);
    }
    if (!text) return json({ ok: false, error: "AI javob bermadi" }, 502, cors);

    const out = JSON.stringify({ ok: true, text: text, model: 'workers-ai' });
    const resp = new Response(out, { headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=604800' }, cors) });
    try { await cache.put(cacheKey, resp.clone()); } catch (e) {}
    return resp;
  }
};
