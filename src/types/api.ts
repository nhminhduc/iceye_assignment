export interface Acquisition {
  timestamp: number;
  ore_sites: number;
}

export interface UpdateUserPayload {
  userId: string;
  name: string;
  password?: string;
}
