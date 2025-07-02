### FridgePal

FridgePal is a smart fridge inventory management app built with **React** and **FastAPI**. It helps users track food items, manage expiry dates, and reduce waste — all with a clean and modern UI.

## Features

- Add, edit, and delete fridge items with quantity and category tracking  
- Trash view to restore or permanently delete recently deleted items  
- Expiry countdown display with color-coded alerts for freshness  
- Fast, responsive, and elegant UI built with Tailwind CSS  
- Full-stack deployment powered by React frontend and FastAPI backend on Render
- Recipe Suggestions for available ingredients 

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI
- **Database:** Appwrite
- **Deployment:** Render



## Getting Started (Local Setup)

```bash
# Clone the repo
git clone https://github.com/Ad-Manisha/fridgepal.git

# Backend (FastAPI)
cd fridgepal-backend
uvicorn main:app --reload

# Frontend (React)
cd ../fridgepal-frontend/fridgepal
npm install
npm run dev
```
