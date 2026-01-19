# Sudoku API

Backend API for the Sudoku application. Available in two deployment versions.

## Deployments

| Version | Platform | URL | Description |
|---------|----------|-----|-------------|
| v1 | DigitalOcean (Docker) | https://api.sudoku.theflywheel.in | Express.js server |
| v2 | Vercel (Serverless) | https://v2-api.sudoku.theflywheel.in | Serverless functions |

## API Endpoints

### Health Check
```
GET /health
```
Returns API status, version, and timestamp.

### Generate Puzzle
```
GET /sudoku?difficulty=easy|medium|hard
```
Generates a new Sudoku puzzle with the specified difficulty.

**Response:**
```json
{
  "success": true,
  "data": {
    "puzzle": [[...]],
    "solution": [[...]],
    "difficulty": "medium",
    "givenCells": 36,
    "puzzleString": "...",
    "solutionString": "..."
  }
}
```

### Validate Solution
```
POST /sudoku/validate
Content-Type: application/json

{
  "board": [[9x9 array of numbers]]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "Valid Sudoku solution!"
  }
}
```

## Project Structure

```
api/
├── health.js              # Health check endpoint (v2)
├── index.js               # Root endpoint (v2)
├── sudoku/
│   ├── generator.js       # Sudoku generation logic (shared)
│   ├── index.js           # GET /sudoku endpoint (v2)
│   └── validate.js        # POST /sudoku/validate endpoint (v2)
├── v1/
│   ├── index.js           # Express server (v1)
│   └── sudoku.js          # Sudoku logic (v1)
├── Dockerfile             # Docker config for v1 deployment
├── vercel.json            # Vercel config for v2 deployment
└── package.json           # Dependencies
```

## Local Development

### v1 (Express)
```bash
cd api
npm install
npm start
```

### v2 (Vercel)
```bash
cd api
vercel dev
```

## Deployment

### v1 (DigitalOcean)
Deploy using Docker:
```bash
docker build -t sudoku-api .
docker run -p 3000:3000 sudoku-api
```

### v2 (Vercel)
Deploy using Vercel CLI:
```bash
vercel --prod
```
