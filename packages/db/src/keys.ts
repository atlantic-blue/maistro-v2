export const Keys = {
  user: {
    pk: (userId: string) => `USER#${userId}` as const,
    sk: () => "PROFILE" as const,
    gsi1pk: (email: string) => `EMAIL#${email}` as const,
    gsi1sk: () => "USER" as const,
  },

  project: {
    pk: (userId: string) => `USER#${userId}` as const,
    sk: (projectId: string) => `PROJECT#${projectId}` as const,
    gsi1pk: (slug: string) => `SLUG#${slug}` as const,
    gsi1sk: () => "PROJECT" as const,
  },

  landingPage: {
    pk: (projectId: string) => `PROJECT#${projectId}` as const,
    sk: () => "LANDING_PAGE" as const,
  },

  signup: {
    pk: (projectId: string) => `PROJECT#${projectId}` as const,
    sk: (timestamp: string, id: string) => `SIGNUP#${timestamp}#${id}` as const,
    skPrefix: () => "SIGNUP#" as const,
  },

  event: {
    pk: (projectId: string) => `PROJECT#${projectId}` as const,
    sk: (timestamp: string, id: string) => `EVENT#${timestamp}#${id}` as const,
    skPrefix: () => "EVENT#" as const,
  },

  stats: {
    pk: (projectId: string) => `PROJECT#${projectId}` as const,
    sk: (date: string) => `STATS#${date}` as const,
    skPrefix: () => "STATS#" as const,
  },
} as const;

export const GSI_NAMES = {
  GSI1: "GSI1",
} as const;
