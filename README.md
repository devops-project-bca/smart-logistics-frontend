# Smart Logistics System

Smart Logistics System is a full-stack web application developed to manage logistics operations efficiently.  
The project consists of a React Frontend and a Spring Boot Backend, integrated with CI/CD, SonarCloud analysis, Docker, and cloud deployment.

---

## 🚀 Live Deployments

### 🌐 Frontend – Vercel
Live URL:  
https://smart-logistics-frontend-mocha.vercel.app

---

### 🌐 Frontend – Render
Live URL:  
https://smart-logistics-frontend-2.onrender.com

Note:  
This service is hosted on Render Free Plan.  
If inactive, the service may take 30–60 seconds to start on first access.

---

## 🔧 Backend – Docker (Local)

The backend is containerized using Docker and runs locally.

Run backend using Docker:

docker build -t smart-logistics-backend .  
docker run -d -p 8080:8080 --name smart-backend smart-logistics-backend

Backend Base URL:  
http://localhost:8080

Sample API Endpoint:  
http://localhost:8080/api/shipments

---

## 📊 Code Quality – SonarCloud

SonarCloud analysis is configured for both frontend and backend.

Quality Gate Status: PASSED  
Security: A  
Reliability: A  
Maintainability: A  

---

## ⚙️ CI/CD

GitHub Actions configured for:
- Build
- Test
- SonarCloud analysis
- Pull Request workflow

---

## 🛠️ Tech Stack

Frontend:
React, JavaScript, HTML, CSS, Axios, Vercel, Render

Backend:
Java, Spring Boot, REST APIs, Maven, Docker

DevOps:
GitHub, GitHub Actions, SonarCloud, Docker, Vercel, Render

---

## ▶️ Run Frontend Locally

git clone https://github.com/devops-project-bca/smart-logistics-frontend.git  
cd smart-logistics-frontend  
npm install  
npm start  

Frontend runs at:  
http://localhost:3000

---

## 👨‍💻 Developer

Shakthi Nandha  
BCA – DevOps Project
