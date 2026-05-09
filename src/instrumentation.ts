// Runs once per Next.js server / Vercel function instance startup.
// We pre-import MongoDB connection so the TLS handshake + replica set
// discovery happens during boot in parallel with the rest of the runtime,
// instead of paying the full latency on the first request that hits the DB.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  try {
    await import('@/lib/mongodb/connection');
  } catch (err) {
    console.error('instrumentation: mongodb pre-warm failed:', err);
  }
}
