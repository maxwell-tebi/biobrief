# BioBrief

BioBrief helps patients in Ghana understand their medical lab results. Upload a lab result image or paste the text, and the app explains what the values mean in plain English and Twi (Akan), suggests relevant foods to eat or avoid, checks how your symptoms connect to your results, and shows health facilities near you.

---

## Features

- **Lab Result Analysis** -- Upload a photo of your lab result or paste the text directly
- **Plain Language Explanations** -- Flags abnormal values and explains what they mean without medical jargon
- **Twi Translation** -- Every section can be switched to Twi (Akan) with one click
- **Dietary Suggestions** -- Lists foods to eat more of and foods to reduce, based on your flagged values
- **Symptom Checker** -- Describe how you feel and get an explanation of how your symptoms may relate to your results
- **Clinic Finder** -- Uses your browser location to show nearby hospitals, clinics, and health centres on a map

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios |
| Backend | Node.js, Express.js, Multer |
| AI | Google Gemini 2.5 Flash |
| Maps | OpenStreetMap (embed), Overpass API |
| Deployment | Vercel (frontend), Render or Railway (backend) |

No database. The app is fully stateless.

---

## Project Structure

```
biobrief/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LanguageToggle.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ResultPanel.jsx
│   │   │   ├── SymptomChecker.jsx
│   │   │   └── UploadPanel.jsx
│   │   ├── pages/
│   │   │   └── ClinicFinder.jsx
│   │   ├── services/
│   │   │   └── analyzeService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                        # Express backend
│   ├── middleware/
│   │   └── upload.js
│   ├── routes/
│   │   ├── analyze.js
│   │   └── symptoms.js
│   ├── services/
│   │   └── geminiService.js
│   ├── app.js
│   └── server.js
├── .env                           # Not committed
├── .gitignore
└── AI.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Google Gemini API key (free tier works). Get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/maxwell-tebi/biobrief.git
cd biobrief
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the app

Open two terminals.

**Terminal 1 -- Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 -- Frontend:**
```bash
cd client
npm run dev
```

The app runs at `http://localhost:5173`. The backend runs at `http://localhost:5000`.

---

## API Endpoints

### `POST /api/analyze`

Analyzes a lab result from an image or text.

**Image upload:**
```
Content-Type: multipart/form-data
Body: file (JPEG, PNG, or WebP, max 5MB)
```

**Text input:**
```json
{ "text": "Hemoglobin: 11.2 g/dL, WBC: 7.5" }
```

**Response:**
```json
{
  "english": {
    "summary": "...",
    "flagged": ["..."],
    "normal": ["..."]
  },
  "twi": {
    "summary": "...",
    "flagged": ["..."],
    "normal": ["..."]
  },
  "diet": {
    "english": { "recommended": ["..."], "limit": ["..."], "tip": "..." },
    "twi": { "recommended": ["..."], "limit": ["..."], "tip": "..." }
  }
}
```

---

### `POST /api/symptoms`

Cross-references reported symptoms with flagged lab values.

**Request:**
```json
{
  "symptoms": "I feel tired and dizzy",
  "flagged": ["Hemoglobin: 11.2 g/dL -- slightly low"]
}
```

**Response:**
```json
{
  "connection": "...",
  "recommendation": "...",
  "twi": {
    "connection": "...",
    "recommendation": "..."
  }
}
```

---

### `GET /health`

Returns `{ "status": "ok" }`. Used to verify the server is running.

---

## Clinic Finder

The Clinic Finder page does not use a backend. It runs entirely in the browser:

1. Requests location permission via the browser Geolocation API
2. Queries the [Overpass API](https://overpass-api.de/) for hospitals, clinics, and health centres within 10 km
3. Displays results on an OpenStreetMap embed with distance, phone number, and a link to Google Maps directions

---

## Disclaimer

BioBrief is a translation and explanation tool. It is not a medical device and does not provide diagnoses. Always consult a qualified healthcare professional about your results.

---

## License

MIT
