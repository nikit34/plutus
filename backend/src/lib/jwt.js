import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signAuthToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtTtl,
  });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export function signDownloadToken(payload, ttlSeconds = config.downloadTtl) {
  return jwt.sign(payload, config.downloadSecret, { expiresIn: ttlSeconds });
}

export function verifyDownloadToken(token) {
  return jwt.verify(token, config.downloadSecret);
}
