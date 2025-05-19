# Adaptive Travel Guide

**Adaptive Travel Guide** — вебзастосунок, що надає персоналізовані туристичні рекомендації на основі профілю користувача. Реалізований на стеку Django + React.

## Стек технологій

- **Backend**: Python, Django 5.2, Django REST Framework, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Аутентифікація**: JWT, Google OAuth
- **Документація API**: drf-spectacular (OpenAPI 3.0, Swagger UI)

## Встановлення

### Попередні вимоги

- Python 3.11+
- Node.js 20+ та npm
- PostgreSQL
- Git

### Клонування репозиторію

```bash
git clone https://github.com/olyflower/adaptive-travel-guide
cd adaptive-travel-guide

cd backend
python -m venv venv
source venv/bin/activate  # або venv\Scripts\activate на Windows
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver 8000


cd ../frontend
npm install
npm run dev

Фронтенд: http://localhost:5173
Бекенд: http://localhost:8000
Документація API: http://localhost:8000/api/docs/