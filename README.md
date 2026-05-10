# Apex Pro Tuner

ชุดเครื่องมือปรับแต่งประสิทธิภาพเกมระดับพรีเมียม (Premium Game Enhancement Utility)

## วิธีการติดตั้งบน GitHub (How to Deploy to GitHub)

หากคุณนำโค้ดนี้ไปใส่ใน GitHub และพบปัญหาหน้าจอขาว (White Screen) ให้ทำตามขั้นตอนดังนี้:

### 1. วิธีการ Deploy ผ่าน GitHub Pages
เนื่องจากโปรเจกต์นี้ใช้ **Vite**, คุณไม่สามารถแค่ลากไฟล์ขึ้นไปแล้วเปิดได้เลย คุณต้องทำการ Build ก่อน

#### วิธีที่ง่ายที่สุด (ใช้ GitHub Actions):
1. ไปที่เมนู **Settings** ใน Repository ของคุณ
2. เลือกเมนู **Pages** ทางด้านซ้าย
3. ในส่วนของ **Build and deployment** > **Source**, ให้เลือกเป็น **GitHub Actions**
4. กดสร้าง Workflow ใหม่สำหรับ **Static HTML** หรือค้นหาคำว่า **Vite** ในหน้า Actions
5. หรือใช้ไฟล์ `.github/workflows/deploy.yml` ต่อไปนี้:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. เกี่ยวกับรหัสผ่าน (Password)
รหัสผ่านปัจจุบันถูกตั้งไว้เป็น: `darkaura` (พิมพ์ในช่อง input แล้วกด Authenticate)

### 3. ฟีเจอร์หลัก (Features)
- **Aim Assist (ดูดหัว):** ระบบช่วยเล็งประสิทธิภาพสูง
- **Auto Drag (ช่วยลาก):** ระบบลดแรงดีดและช่วยลากเป้า
- **DPI Config:** ปรับแต่งความเร็วเมาส์เสมือน (500 - 1000)
- **144Hz Boost:** ปรับแต่งการแสดงผลให้ลื่นไหล

## หมายเหตุ
โปรเจกต์นี้ถูกสร้างขึ้นเพื่อการเรียนรู้และการปรับแต่ง UI เท่านั้น
