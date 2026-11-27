export const ADMIN_STRINGS = {
  SIDEBAR: {
    LOGO: 'AgriLink Admin',
    SECTOR_LABEL: 'Administration',
    NAV: {
      CONTROL_CENTER: 'Overview',
      KYC_HUB: 'Users',
      MODERATION: 'Moderation',
      FINANCIAL: 'Transactions',
      BROADCAST: 'Broadcast',
      INFRASTRUCTURE: 'System Health',
      AUDIT: 'Audit Trail',
    },
    LOGOUT: 'Sign out',
    STATUS_ONLINE: 'Online',
  },
  DASHBOARD: {
    TITLE: 'Platform Health',
    SUBTITLE: 'Users, verification and platform activity at a glance',
    PULSE_LABEL: 'Platform status',
    PULSE_STABLE: 'See System Config for live service health',
    NODES_LABEL: 'Services',
    NODES_STABLE: '7 services',
    STATS: {
      IDENTITIES: 'Total users',
      KYC: 'KYC approved',
      ACQUISITIONS: 'New this week',
      INTEGRITY: 'Services healthy',
    },
    CHARTS: {
      GROWTH_TITLE: 'Registrations',
      GROWTH_SUB: 'Verified sign-ups, last 7 days',
    },
    QUEUE: {
      TITLE: 'Pending Decisions',
      SUB: 'Waiting for an admin decision',
      CLEAR: 'Nothing waiting — the queue is clear',
    }
  },
  KYC: {
    TITLE: 'KYC review',
    SUBTITLE: (count: number) => `${count} submission(s) waiting for review`,
    SEARCH_PLACEHOLDER: 'Search by name or email…',
  },
  MODERATION: {
    TITLE: 'Review moderation',
    SUBTITLE: (count: number) => `${count} flagged review(s)`,
    LOGS_TITLE: 'Recent admin actions',
    LOGS_SUB: 'From the audit trail',
  },
  BROADCAST: {
    TITLE: 'Send an announcement',
    SUBTITLE: 'Notify farmers, suppliers or everyone in the app (and by email if enabled)',
    REACH_LABEL: 'Registered users',
    SPEED_LABEL: 'Delivered via',
    SPEED_VALUE: 'In-app',
    HISTORY_TITLE: 'Recent announcements',
    HISTORY_SUB: 'Last 5 sent',
  },
  INFRASTRUCTURE: {
    TITLE: 'System health',
    SUBTITLE: 'Live service status and platform settings',
    TOPOLOGY_TITLE: 'Services',
    TOPOLOGY_SUB: 'Refreshed every 15 seconds',
    PROTOCOL_TITLE: 'Platform settings',
    PROTOCOL_SUB: 'Key / value settings stored in the auth database',
    RESOURCE_TITLE: 'Host resources',
    RESOURCE_SUB: 'Auth service host',
  },
  AUDIT: {
    TITLE: 'Audit trail',
    SUBTITLE: 'Every admin action, who did it and when',
    LOGS_LABEL: 'Entries',
  }
};

export const ADMIN_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  REFRESH_INTERVAL: 5000,
  CHART_COLORS: {
    PRIMARY: '#ef4444',
    SECONDARY: '#10b981',
  }
};
