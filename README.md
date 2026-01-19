# Sudoku App

A full-stack Sudoku application with a React frontend and serverless API backend.

## Project Structure

```
sudoku-app/
├── apps/
│   ├── web/          # React + TypeScript frontend (Vite)
│   └── api/          # Sudoku API (Express v1 + Vercel Serverless v2)
├── package.json      # Root workspace configuration
└── README.md
```

## Live Deployments

| App | Platform | URL |
|-----|----------|-----|
| Web | Vercel | TBD |
| API v1 | DigitalOcean | https://api.sudoku.theflywheel.in |
| API v2 | Vercel | https://v2-api.sudoku.theflywheel.in |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

Run the frontend:
```bash
npm run dev:web
```

Run the API (Vercel serverless):
```bash
npm run dev:api
```

## Apps

### Web (`apps/web`)

React + TypeScript frontend built with Vite. Features:
- Interactive Sudoku game board
- Multiple difficulty levels
- Solution validation

### API (`apps/api`)

Sudoku puzzle generation and validation API. See [API README](./apps/api/README.md) for detailed documentation.

**Endpoints:**
- `GET /health` - Health check
- `GET /sudoku?difficulty=easy|medium|hard` - Generate puzzle
- `POST /sudoku/validate` - Validate solution

## License

MIT
