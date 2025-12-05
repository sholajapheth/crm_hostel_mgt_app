export interface Zone {
  id: string;
  name: string;
  description: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneRequest {
  name: string;
  description: string;
  isActive: number;
}

export interface UpdateZoneRequest extends Partial<CreateZoneRequest> {}
