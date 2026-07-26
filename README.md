# Antidoping Kompetensiyasi — Ta'lim Portali

WADA va UzNADO standartlariga asoslangan antidoping ta'lim portali. Rahbarlar, murabbiylar, metodistlar va sportchilar uchun 40 mavzu, 80 test savoli, interaktiv trening va sertifikat tizimi.

🔗 **Live sayt:** portal GitHub Pages orqali ishga tushirilgandan so'ng shu yerda ko'rinadi (pastdagi yo'riqnomaga qarang).

## 📁 Fayl tuzilishi

```
.
├── index.html   ← to'liq portal (bitta fayl, barcha rasm/shrift ichida)
└── README.md
```

Portal **bitta HTML fayl** ko'rinishida ishlab chiqilgan — barcha stil, skript va media resurslar fayl ichiga joylashtirilgan. Shuning uchun uni oddiy statik hosting (GitHub Pages) orqali qo'shimcha sozlashsiz ishga tushirish mumkin.

## 🚀 GitHub Pages orqali yuklash va ishga tushirish

### 1-usul: GitHub veb-saytida (kodlashsiz)

1. [github.com](https://github.com) ga kiring va yangi repository yarating (masalan `antidoping-portal`) — **Public** qilib tanlang.
2. Repository sahifasida **"Add file" → "Upload files"** tugmasini bosing.
3. Ushbu papkadagi `index.html` va `README.md` fayllarini (yoki shu zip ichidagi fayllarni) sudrab tashlang.
4. **"Commit changes"** tugmasini bosing.
5. Repository ichida **Settings → Pages** bo'limiga o'ting.
6. **"Build and deployment"** ostida **Source: Deploy from a branch** tanlang.
7. **Branch: `main`**, papka: **`/ (root)`** tanlab **Save** bosing.
8. 1–2 daqiqadan so'ng sahifa yuqorida ko'rsatiladigan manzilda ishga tushadi:
   ```
   https://<username>.github.io/<repository-nomi>/
   ```

### 2-usul: Terminal orqali (git bilan)

```bash
cd antidoping-portal
git init
git add .
git commit -m "Antidoping portal - dastlabki yuklash"
git branch -M main
git remote add origin https://github.com/<username>/<repository-nomi>.git
git push -u origin main
```

So'ng yuqoridagi 5–8-qadamlarni bajarib GitHub Pages'ni yoqing.

## 🔄 Yangilash

Portalga o'zgartirish kiritilganda, faqat `index.html` faylini yangilab, qayta yuklash (upload) yoki `git push` qilish yetarli — GitHub Pages avtomatik yangilanadi.

## 🛠 Texnologiyalar

- Toza HTML/CSS/JavaScript (freymvorksiz, bitta faylda)
- Three.js (3D DNA vizualizatsiyasi)
- Google Fonts: Inter, Poppins
- Responsive dizayn (mobil va desktop uchun moslashgan)

## ⚠️ Eslatma

- Portal dizayni **o'zgartirilmasligi** kerak bo'lgan asl (original) ko'rinishda saqlangan.
- Fayl hajmi katta (~3 MB) bo'lishi mumkin, chunki barcha rasm/shrift resurslari base64 formatda fayl ichiga joylashtirilgan — bu holat GitHub Pages uchun muammo emas.
