# Managingmovie

# 🎬 Movie Management System — Technical Exam Submission

ระบบจัดการภาพยนตร์แบบ CRUD พร้อมการควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control)  
พัฒนาโดยใช้ **Node.js + Express + MongoDB** สำหรับ backend และ **React + TypeScript** สำหรับ frontend

---

⚠️ หมายเหตุสำคัญ: นี่เป็นโปรเจกต์ ReactJS ตัวแรกของผม! 🚀
มีการวางโครงสร้างและสถาปัตยกรรมระบบที่รองรับการต่อยอดและขยายฟีเจอร์ในอนาคต
แม้จะเป็นผลงานชิ้นแรก แต่ได้ใส่หัวใจและความพยายามอย่างเต็มที่ในการสร้างระบบที่มีคุณภาพ ✨

ระบบจัดการภาพยนตร์แบบ CRUD พร้อมการควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control)
พัฒนาโดยใช้ Node.js + Express + MongoDB สำหรับ backend และ React + TypeScript สำหรับ frontend

## 📦 Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Axios, Context API
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Authentication:** Role-based access (MANAGER, TEAMLEADER, FLOORSTAFF)
- **Extras:** Responsive UI, AlertDialog ยืนยันการลบ, useMobile hook

---

## 🚀 วิธีใช้งานโปรเจกต์

### 1. ติดตั้ง dependencies

#### Backend

```bash
cd Backend
npm install
Frontend
bash
cd Frontend
npm install
2. ตั้งค่า environment variables
สร้างไฟล์ .env ในโฟลเดอร์ Backend:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/movies
JWT_SECRET=your-secret-key
3. รันระบบ
Backend
bash
npm run dev
Frontend
bash
npm run dev
👥 บทบาทผู้ใช้งาน
Role	สิทธิ์ในการใช้งาน
MANAGER	เพิ่ม, แก้ไข, ลบ, ดู
TEAMLEADER	เพิ่ม, แก้ไข, ดู
FLOORSTAFF	ดูเท่านั้น
🔐 ความปลอดภัย
ใช้ JWT สำหรับการยืนยันตัวตน

Middleware ตรวจ token และ role ก่อนเข้าถึง route

ข้อมูลผู้สร้าง (createdBy) ถูก inject จาก req.user.username โดย backend

🧠 โครงสร้างระบบ
โค้ด
TechnicalExam_Natthaphong/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
└── README.md
✨ จุดเด่นของโปรเจกต์
✅ ใช้ TypeScript ทั้ง frontend และ backend

✅ UI สวยงาม พร้อม responsive design

✅ ใช้ Context API จัดการ state อย่างเป็นระบบ

✅ มี AlertDialog ยืนยันการลบ

✅ มี useMobile hook สำหรับตรวจขนาดหน้าจอ

✅ โค้ดแยกส่วนชัดเจน อ่านง่าย และ maintain ได้
```
