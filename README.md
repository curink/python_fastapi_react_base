# python fastapi react base

## cara install
package yg perlu di install
- termux
```bash
pkg update && pkg upgrade
pkg install python rust nodejs git
```
- acode terminal (Alpine linux)
```bash
apk update && apk upgrade
apk add python3 py3-pip rust nodejs npm git
```
clone
```bash
git clone https://github.com/curink/python_fastapi_react_base.git && cd python_fastapi_react_base
```

lalu jalankan
```bash
bash install.sh
```

aktifkan environment
```bash
source venv/bin/activate
```

lalu jalankan server
```bash
uvicorn app.main:app --reload
```

### waktu dibuat
- Python 3.12.11
- Rustc 1.88.0
- Nodejs 24.4.1