import os
from dotenv import load_dotenv
import google.generativeai as genai

# ============================
# 1. LOAD API KEY
# ============================
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ API Key kosong! Cek file .env")
    exit()
else:
    print(f"✅ API Key terbaca: {api_key[:10]}...")

# ============================
# 2. KONFIGURASI GOOGLE AI
# ============================
genai.configure(api_key=api_key)

print("\n🔍 Mengecek izin dan daftar model yang tersedia ...\n")

try:
    # ============================
    # 3. LIST MODEL
    # ============================
    print("📋 Model yang mendukung generateContent:")
    available_models = []

    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"   - {m.name}")
            available_models.append(m.name)

    if not available_models:
        print("\n⚠️ Tidak ada model yang tersedia!")
        print("   Aktifkan 'Generative Language API' di Google Cloud Console.")
        exit()

    # Pilih model default (ambil yang paling mirip Flash/Pro)
    if "gemini-1.5-flash" in available_models:
        selected_model = "gemini-1.5-flash"
    elif "gemini-1.5-pro" in available_models:
        selected_model = "gemini-1.5-pro"
    else:
        selected_model = available_models[0]  # fallback

    print(f"\n✅ Menggunakan model: {selected_model}")

    # ============================
    # 4. TES PEMANGGILAN MODEL
    # ============================
    print("\n🧪 Menguji komunikasi dengan model ...")
    model = genai.GenerativeModel(selected_model)
    response = model.generate_content("Halo, apakah kamu aktif?")
    print(f"🤖 Jawaban Gemini: {response.text}")

except Exception as e:
    print("\n❌ TERJADI ERROR SERIUS:")
    print(e)
    print("\nPENYEBAB KEMUNGKINAN:")
    
    msg = str(e)
    if "400" in msg:
        print("- API Key salah atau request model tidak valid.")
    if "403" in msg:
        print("- Izin ditolak. Billing atau akses API bermasalah.")
    if "404" in msg:
        print("- Model tidak ditemukan. Biasanya karena API key baru atau model salah ketik.")
