# 🚑 MedRoute – Ambulance Delay Prediction & Smart Hospital Recommendation

MedRoute is a full-stack emergency-response web application that predicts ambulance travel delay using Machine Learning and recommends the fastest reachable hospital based on Estimated Time of Arrival (ETA).

The system integrates Machine Learning, FastAPI, React, and PostgreSQL to provide a decision-support tool for emergency scenarios.

---

## 📌 Project Overview

In emergency situations, the nearest hospital is not always the fastest option due to traffic conditions and travel delays.

MedRoute solves this by:

- Predicting ambulance delay using a trained ML model  
- Calculating hospital-specific ETA  
- Recommending the fastest hospital  
- Visualizing routes on an interactive map  
- Logging emergency requests into a PostgreSQL database  

---

## 🚀 Features

### 🚑 Smart Hospital Recommendation
- Recommends the fastest hospital based on ETA
- Uses geospatial distance + ML delay prediction
- Applies regional validation (Bengaluru boundary check)

### 🤖 Machine Learning Prediction
Predicts ambulance delay using:

- Distance to hospital
- Hour of the day
- Weekend/weekday
- Traffic level
- Rush hour status

Model Used: RandomForestRegressor (Scikit-learn)

### 🗺 Interactive Map Interface
- Click to select emergency location
- Search locations using OpenStreetMap
- Hospital markers
- Route visualization
- Clear separation of ETA vs Predicted Delay

### 📊 Data Logging
Stores each emergency request including:
- Emergency location
- Recommended hospital
- Distance
- Predicted delay
- ETA
- Timestamp

---

## 🏗 System Architecture

User  
↓  
React Frontend  
↓  
FastAPI Backend  
↓  
PostgreSQL Database  
↓  
Machine Learning Model  

---

## 🔄 Application Workflow

1. User selects emergency location (map or search)
2. Frontend sends request to FastAPI backend
3. Backend fetches hospital data from PostgreSQL
4. Haversine formula calculates distance
5. ML model predicts traffic delay
6. ETA is computed (Ideal Time + Predicted Delay)
7. Fastest hospital is selected
8. Emergency request is stored in database
9. Results returned to frontend

---

## 🧰 Technologies Used

### Frontend
- React.js
- Axios
- React Leaflet
- OpenStreetMap
- CSS

### Backend
- FastAPI
- Python
- SQLAlchemy
- Uvicorn

### Machine Learning
- Scikit-learn
- Random Forest Regressor
- Pandas
- Joblib

### Database
- PostgreSQL

---
## 📂 Project Structure

```
project/

├── ambulance-delay-backend/
│   │
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models.py
│   │   ├── recommender.py
│   │   ├── predictor.py
│   │   ├── hospitals.py
│   │   ├── model_loader.py
│   │   ├── distance.py
│   │   ├── eta.py
│   │   ├── geo.py
│   │   ├── traffic.py
│   │   └── schemas.py
│   │
│   ├── data/
│   │   └── hospitals_clean.csv
│   │
│   ├── models/
│   │   └── delay_predictor_rf_v1.pkl
│   │
│   └── seed_hospitals.py
│
├── ambulance-delay-frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.js
│   │   │   ├── ResultPanel.js
│   │   │   ├── ControlPanel.js
│   │   │   └── SearchBar.js
│   │   │
│   │   ├── App.js
│   │   ├── api.js
│   │   └── index.js
```
---

## 🗄 Database Schema

### hospitals Table

- hospital_id (Primary Key)
- name
- lat
- lon
- emergency_available

### emergency_requests Table

- id (Primary Key)
- lat
- lon
- hour
- is_weekend
- hospital_name
- distance_km
- predicted_delay
- eta_minutes
- created_at

---

## ⚙ Local Installation Guide

### Backend Setup

cd ambulance-delay-backend  
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt  

Create `.env` file:

DATABASE_URL=postgresql://username:password@localhost:5432/ambulance_db  

Run backend:

uvicorn app.main:app --reload  

---

### Seed Hospital Data

python seed_hospitals.py  

---

### Frontend Setup

cd ambulance-delay-frontend  
npm install  
npm start  

Create `.env`:

REACT_APP_API_BASE=http://127.0.0.1:8000  

---

## 📡 API Endpoints

GET /  
Health check  

POST /predict-delay  
Predict traffic delay  

POST /recommend-hospital  
Recommend fastest hospital and store emergency request  

GET /hospitals  
Fetch hospital list  

---

## 🎯 Future Enhancements

- Real-time traffic API integration
- Multi-city expansion
- Authentication system
- Admin analytics dashboard
- Live ambulance tracking