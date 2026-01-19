export default function handler(req, res) {
  res.json({ status: 'ok', version: '2.0.1', timestamp: new Date().toISOString() });
}
