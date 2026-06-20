# Adaptive Travel Guide

**Adaptive Travel Guide** — інтелектуальний вебзастосунок, 
що надає персоналізовані туристичні рекомендації 
на основі профілю користувача. 
Реалізований на стеку Django + React.

## Стек технологій

- **Backend**: Python, Django, Django REST Framework, PostgreSQL (Neon), pgvector
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Локалізація**: react-i18next (UA/EN)
- **Аутентифікація**: JWT, Google OAuth
- **DevOps**: Docker, Docker Compose
- **Документація API**: drf-spectacular (OpenAPI 3.0, Swagger UI)

## Встановлення та запуск
Проєкт можна запускати за допомогою Docker або локально.

### Запуск через Docker
*Попередні вимоги: встановлений Docker та Docker Compose*

- Налаштуйте змінні оточення: створіть файли .env у папках backend/ та frontend/ на основі прикладів .env.example
- Зберіть та запустіть контейнери:
```bash
	docker compose up --build
```
- Виконайте міграції та створіть адміністратора:
```bash
	docker compose exec backend python manage.py migrate
	docker compose exec backend python manage.py createsuperuser
```

### Локальне встановлення
Попередні вимоги:
- Python 3.12+
- Node.js 20+ та npm
- PostgreSQL або Neon PostgreSQL
- Git

### Клонування репозиторію

```bash
git clone https://github.com/olyflower/adaptive-travel-guide
cd adaptive-travel-guide

cd backend
python -m venv .venv

source .venv/bin/activate   # Linux / macOS
.venv\Scripts\activate      # Windows

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver 8000


cd ../frontend
npm install
npm run dev
```
## Основні можливості

- Реєстрація та автентифікація користувачів (JWT, Google OAuth)
- Персоналізовані рекомендації туристичних локацій
- Створення та керування планами подорожей
- Створення автомобільного маршруту подорожі
- Інтерактивна карта локацій
- Отримання актуальних даних про погоду та валютний курс
- Підтримка української та англійської мов

## Доступ до сервісів
Після запуску застосунок доступний за адресами:

- Фронтенд: http://localhost:5173
- Бекенд: http://localhost:8000
- Адмін-панель: http://localhost:8000/admin/
- Документація API: http://localhost:8000/api/docs/


## Технології рекомендацій
Для побудови персоналізованих рекомендацій використовуються:

- Sentence Transformers
- Векторні ембедінги
- pgvector
- Косинусна схожість
- Профіль користувача та його вподобання