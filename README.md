"""
# Repair Tutorial Platform (Backend)

### 🛠 Requirements
- Python 3.9+
- pip
- virtualenv (optional but recommended)

### ⚙️ Setup Instructions

1. **Clone the repo and navigate to backend folder**

```bash
git clone <your-repo-url>
cd repair-recipes/backend
```

2. **Set up a virtual environment (optional)**

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

3. **Install dependencies**

```powershell
pip install -r requirements.txt
```

4. **Apply migrations and run the dev server**

```powershell
python manage.py migrate
python manage.py createsuperuser  # (optional, for admin panel)
python manage.py runserver
```

5. **Access API**
- Vehicle List: `http://127.0.0.1:8000/vehicles/`
- Tutorial List: `http://127.0.0.1:8000/tutorials/`
- Create Tutorial: `POST http://127.0.0.1:8000/tutorials/create/`

6. **(Optional)** Add test data through the Django admin at `http://127.0.0.1:8000/admin/`
"""