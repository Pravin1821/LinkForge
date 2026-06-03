# Forge Links - Frontend

Forge Links is a premium link management platform with real-time analytics, QR codes, and workspace insights.

## Tech Stack

- **Framework:** React 19 (Vite 8)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Routing:** React Router 7
- **API Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Environment Setup

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 🚀 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

### Configuration

The project includes a `vercel.json` file to handle SPA routing (client-side redirects).

### Environment Variables

When deploying to Vercel, ensure you set the following environment variable in the Vercel Dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | The base URL of your backend API | `https://api.forge.ly` |

### Deployment Steps

1. Connect your GitHub repository to Vercel.
2. Select the `client` directory as the Root Directory.
3. Vercel will automatically detect Vite.
4. Add the `VITE_API_URL` environment variable.
5. Click **Deploy**.

The frontend will be deployed, and all routes (e.g., `/dashboard`, `/analytics`) will work correctly on refresh.
