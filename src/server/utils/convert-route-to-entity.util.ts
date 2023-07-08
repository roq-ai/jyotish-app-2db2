const mapping: Record<string, string> = {
  astrologers: 'astrologer',
  charts: 'chart',
  customers: 'customer',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
