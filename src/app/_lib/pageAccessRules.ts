interface AccessRules {
  requiresAdmin?: boolean;          // Optional; whether admin access is required
  requiresSubscription?: boolean;  // Optional; whether a subscription is required
}


export const pageAccessRules: Record<string, AccessRules> = {
    //GENERAL PROTECTED ROUTES
    '/dashboard': { requiresAdmin: false, requiresSubscription: false },
    '/dashboard/calls/:path': { requiresAdmin: false, requiresSubscription: false },
    '/dashboard/calls': { requiresAdmin: false, requiresSubscription: false },
    '/dashboard/leads/:path': { requiresAdmin: false, requiresSubscription: false },
    '/dashboard/leads': { requiresAdmin: false, requiresSubscription: false },
    '/settings': { requiresAdmin: false, requiresSubscription: false },
    '/settings/profile': { requiresAdmin: false, requiresSubscription: false },

    //ADMIN SPECIFIC ROUTES
    '/settings/account': { requiresAdmin: true, requiresSubscription: false },
    '/settings/team': { requiresAdmin: true, requiresSubscription: false },
    '/settings/team/:path': { requiresAdmin: true, requiresSubscription: false },
    

    //ADMIN & SUBSCRIPTION SPECIFIC ROUTES
    '/dashboard/agents/:path': { requiresAdmin: true, requiresSubscription: true },
  };