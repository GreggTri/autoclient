'use server'

import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SessionPayload } from './definitions'
import { get } from '@vercel/edge-config';
import { SESSION_UPDATE_THRESHOLD } from './constants'


const KEY = new TextEncoder().encode(String(get('JWT_SECRET')))


export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4hr')
      .sign(KEY);
  }
  
export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, KEY, {
        algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createSession(userId: string, isAdmin: boolean, tenantId: string, stripeSubscriptionId: string | null) {
    const cookieStore = await cookies()
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const session = await encrypt({ userId, isAdmin, tenantId, stripeSubscriptionId });
    
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'strict',
        path: '/',
    });
    
}

async function authorizeSession(session: JWTPayload | null, adminOnly: boolean){
    if (!session) return {
        success: false,
        message: "Unauthorized"
    };
    if (adminOnly && session.isAdmin === false) return {
        success: false,
        message: "Unauthorized"
    };

    //update after every request for a rolling 4 hour window
    await updateSession()
    
    return session
}

export async function verifySession(adminOnly: boolean) {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('session')?.value;
    const session = await decrypt(cookie);

    const authSession: JWTPayload = await authorizeSession(session, adminOnly)
    
    if (!authSession.userId) {
        cookieStore.delete('session');
        redirect('/login');
    }
    

    return { 
        isAuth: true, 
        expiresAt: authSession.expiresAt, 
        userId: String(authSession.userId), 
        isAdmin: authSession.isAdmin, 
        tenantId: authSession.tenantId,
        subscriptionId: authSession.stripeSubscriptionId
    };
}

export async function updateSession() {
    const cookieStore = await cookies() 
    const session = cookieStore.get('session')?.value
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    // This condition ensures that the session or token can be refreshed only if it's within a valid time
    // window (determined by the SESSION_UPDATE_THRESHOLD). It avoids refreshing sessions that are too
    // old while allowing updates just before or shortly after expiration.
    
    if(payload.exp! - SESSION_UPDATE_THRESHOLD >= Date.now() - payload.exp!){
    
        const expires = new Date(Date.now() + 4 * 60 * 60 * 1000);

        cookieStore.set('session', session, {
            httpOnly: true,
            secure: true,
            expires: expires,
            sameSite: 'strict',
            path: '/',
        });
    }
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session');

}