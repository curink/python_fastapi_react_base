#!/bin/bash

echo "🔧 Membuat virtual environment..."
python -m venv venv || { echo "❌ Gagal membuat virtual environment"; exit 1; }

echo "📦 Mengaktifkan virtual environment..."
source venv/bin/activate || { echo "❌ Gagal aktivasi virtual environment"; exit 1; }

echo "📝 Menyiapkan file .env..."
if [ ! -f .env ]; then
  cp .env.example .env || { echo "❌ Gagal menyalin .env.example"; exit 1; }
  echo "✅ File .env dibuat dari .env.example"
else
  echo "ℹ️ File .env sudah ada, tidak disalin ulang."
fi

echo "🚀 Menginstall dependencies Python..."
pip install --upgrade pip
pip install -r requirements.txt || { echo "❌ Gagal install dependencies Python"; exit 1; }

echo "🧪 Men-seed admin user..."
PYTHONPATH=. python scripts/seed_admin.py || { echo "❌ Gagal seed admin user"; exit 1; }

echo "📂 Masuk ke direktori frontend..."
cd app/frontend || { echo "❌ Folder frontend tidak ditemukan"; exit 1; }

echo "📦 Menginstall dependencies npm..."
npm install || { echo "❌ Gagal install dependencies npm"; exit 1; }

echo "🏗️ Membuild frontend..."
npx vite build || { echo "❌ Gagal build frontend"; exit 1; }

cd ../../
echo "✅ Instalasi selesai"
echo "➡️ Untuk mengaktifkan virtual environment: source venv/bin/activate"
echo ️"➡️ Untuk mengaktifkan server: \"uvicorn app.main:app --reload\""