'use server';

import { deleteSession } from '../_lib/session';

export async function clearAuthCookie(){
    await deleteSession()
}