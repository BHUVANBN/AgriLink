export const ADMIN_STRINGS = {
  SIDEBAR: {
    LOGO: 'AgriAdmin',
    SECTOR_LABEL: 'Platform Matrix',
    NAV: {
      CONTROL_CENTER: 'Control Center',
      KYC_HUB: 'KYC Decision Hub',
      MODERATION: 'Moderation Desk',
      FINANCIAL: 'Financial Flow',
      BROADCAST: 'Broadcast Command',
      INFRASTRUCTURE: 'System Health',
      AUDIT: 'Audit Trail',
    },
    LOGOUT: 'De-authenticate',
    STATUS_ONLINE: 'Master Link Online',
  },
  DASHBOARD: {
    TITLE: 'Platform Health',
    SUBTITLE: 'Master supervision of the AgriLink V2.0 Core Cluster',
    PULSE_LABEL: 'Global Pulse',
    PULSE_STABLE: 'Stable // 99.9%',
    NODES_LABEL: 'Connected Nodes',
    NODES_STABLE: '7 Active Services',
    STATS: {
      IDENTITIES: 'Total Identities',
      KYC: 'KYC Saturation',
      ACQUISITIONS: 'New Acquisitions',
      INTEGRITY: 'System Integrity',
    },
    CHARTS: {
      GROWTH_TITLE: 'Population Expansion',
      GROWTH_SUB: 'Verified registration trends // 7-Day Window',
    },
    QUEUE: {
      TITLE: 'Pending Decisions',
      SUB: 'Awaiting Supervisor Approval',
      CLEAR: 'Queue is clear // Satisfactory compliance level',
    }
  },
  KYC: {
    TITLE: 'Identity Matrix',
    SUBTITLE: (count: number) => `Awaiting validation protocol for ${count} node(s)`,
    SEARCH_PLACEHOLDER: 'Search specific node...',
  },
  MODERATION: {
    TITLE: 'Sentiment Core',
    SUBTITLE: (count: number) => `Evaluating ${count} flagged marketplace signals`,
    LOGS_TITLE: 'Policy Enforcement Logs',
    LOGS_SUB: 'Recent platform-wide policy executions',
  },
  BROADCAST: {
    TITLE: 'Global Broadcast',
    SUBTITLE: 'Initiating high-priority signal transmission across the AgriLink infrastructure cluster',
    REACH_LABEL: 'Sector Reach',
    SPEED_LABEL: 'Transmission Speed',
    SPEED_VALUE: '~2.4s / Global',
    HISTORY_TITLE: 'Signal History',
    HISTORY_SUB: 'Recent platform broadcast logs',
  },
  INFRASTRUCTURE: {
    TITLE: 'Infrastructure Pulse',
    SUBTITLE: 'Master configuration & real-time node health monitoring',
    TOPOLOGY_TITLE: 'Cluster Topology',
    TOPOLOGY_SUB: 'Real-time status of distributed microservices',
    PROTOCOL_TITLE: 'Protocol Overrides',
    PROTOCOL_SUB: 'System-wide configuration injection',
    RESOURCE_TITLE: 'Resource Core',
    RESOURCE_SUB: 'High-Level system metrics',
  },
  AUDIT: {
    TITLE: 'Forensic Audit',
    SUBTITLE: 'Permanent record of high-privilege operations and system mutations',
    LOGS_LABEL: 'Total Logs',
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
