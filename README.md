# Holiday Management Application

A full-stack application that allows users to search, filter, and view holiday data for a selected country and year. The backend is built with Django and Django REST Framework, and the frontend uses React with Tailwind CSS for styling. The application fetches real-time holiday data using the Calendarific API.

## Features

- **Search & Filter:** Choose a country and year to view corresponding holidays.
- **Holiday Details:** Click on a holiday to view more details in a modal.
- **Custom Search:** Filter holidays by name.
- **Caching:** Holiday data is cached for 24 hours to reduce external API calls.
- **Responsive UI:** Clean and responsive design using Tailwind CSS.

## Technologies

- **Backend:**
  - Django
  - Django REST Framework
  - python-decouple (for environment variables)
  - Requests
  - SQLite

- **Frontend:**
  - React (Create React App)
  - Axios
  - React Router DOM

- **External API:**
  - Calendarific API

## Installation

### Backend Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/vaisagh-mp/holiday_management.git
   cd backend

python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate


pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
The API endpoints should now be available at http://localhost:8000/api/holidays/.


## Frontend Setup

cd ../frontend
npm install
npm start


Usage
1.Open your browser and go to http://localhost:3000.
2.Use the Home Page to select a country and year.
3.View the list of holidays, and use the search bar to filter holidays by name with detailed information.


