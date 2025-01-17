'use server'
import { jwtVerify } from 'jose';
/**
 * Verifies a JWT token and ensures required claims are present.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {object} Decoded payload if valid.
 * @throws {Error} If token is invalid, expired, or missing required claims.
 */
export async function verifyAuthToken(token: string) {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // Decode and verify the token using the secret key
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);



    // Perform optional validation of claims (if needed)
    if (!payload.userId) {
      throw new Error('Missing userId in token');
    }
    if (!payload.tenantId) {
      throw new Error('Missing tenantId in token');
    }

    // If valid, return the decoded payload (claims)
    return payload;
  } catch (error) {

    // Rethrow the error for upstream handling (e.g., redirection)
    throw new Error(`${error}`);
  }
}