import os
from dotenv import load_dotenv
import google.generativeai as genai

# 1. Load API Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ API Key kosong! Cek file .env")
else:
    print(f"✅ API Key terbaca: {api_key[:10]}...")

# 2. Konfigurasi Google AI
genai.configure(api_key=api_key)

print("\n🔍 Sedang menghubungi Google untuk mengecek izin kunci...")

try:
    # 3. Minta daftar model yang tersedia untuk kunci ini
    print("📋 Daftar Model yang Diizinkan untuk Akun ini:")
    found_models = False
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"   - {m.name}")
            found_models = True
    
    if not found_models:
        print("⚠️  Kunci valid, tapi TIDAK ADA model yang tersedia.")
        print("   Solusi: Pastikan 'Generative Language API' sudah aktif di Google Cloud Console.")
    else:
        print("\n✅ Tes Koneksi Sukses! Coba gunakan salah satu nama model di atas.")
        
        # Tes kirim pesan halo sederhana
        print("\n🧪 Mencoba mengirim pesan tes ke Gemini...")
        model = genai.GenerativeModel('gemini-1.5-flash') # Kita coba paksa pakai Flash
        response = model.generate_content("Halo, apakah kamu aktif?")
        print(f"🤖 Jawaban Gemini: {response.text}")

except Exception as e:
    print(f"\n❌ TERJADI ERROR SERIUS:\n{e}")
    print("\nKESIMPULAN:")
    if "400" in str(e) or "INVALID_ARGUMENT" in str(e):
        print("-> API Key mungkin salah ketik atau formatnya rusak.")
    elif "403" in str(e) or "PERMISSION_DENIED" in str(e):
        print("-> API Key valid, tapi DITOLAK. Mungkin kuota habis atau billing bermasalah.")
    elif "404" in str(e):
        print("-> Masalah 'Not Found'. Biasanya karena API Key baru belum 'menyebar' di server Google. Tunggu 5 menit.")
