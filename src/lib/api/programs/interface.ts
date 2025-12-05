export interface Program {
  id: number;
  name: string;
  description?: string;
  duration?: string;
  location?: string;
  price?: string;
  image?: string;
  for: "CRM" | "RCCG" | "BOTH";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProgramRequest {
  name: string;
  description?: string;
  duration?: string;
  location?: string;
  price?: string;
  image?: string;
  for: "CRM" | "RCCG" | "BOTH";
}

export interface UpdateProgramRequest {
  name?: string;
  description?: string;
  duration?: string;
  location?: string;
  price?: string;
  image?: string;
  for?: "CRM" | "RCCG" | "BOTH";
}

export interface ProgramResponse {
  data: Program[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
