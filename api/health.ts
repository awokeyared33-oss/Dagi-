export default function handler(req: any, res: any) {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  return res.status(200).json({
    status: 'ok',
    service: 'Dagi Fitness Cloud Engine & Supabase Authority (Vercel Serverless)',
    timestamp: new Date().toISOString(),
  });
}
