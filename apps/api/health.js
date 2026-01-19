export default function handler(req, res) {
  res.json({ status: 'ok', version: '2.0.0', timestamp: new Date().toISOString() });
}
