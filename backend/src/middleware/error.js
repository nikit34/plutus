export function notFound(req, res) {
  res.status(404).json({ error: 'not_found' });
}

export function errorHandler(err, req, res, _next) {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'validation', issues: err.issues });
  }
  if (err?.status && err?.message) {
    return res.status(err.status).json({ error: err.code || 'error', message: err.message });
  }
  console.error('unhandled error:', err);
  res.status(500).json({ error: 'server_error' });
}

export class HttpError extends Error {
  constructor(status, code, message) {
    super(message || code);
    this.status = status;
    this.code = code;
  }
}
