export interface Hostel {
  id: number;
  name: string;
  location: string;
  capacity: number;
  remainingCapacity: number;
  gender: string;
}

export interface CreateHostelRequest {
  name: string;
  location: string;
  capacity: number;
  remainingCapacity: number;
  gender: string;
}

export interface UpdateHostelRequest extends CreateHostelRequest {}

export interface AssignHostelRequest {
  memberId: number;
  hostelId?: number;
}

export interface AssignAllHostelsResponse {
  message: string;
  assignedCount: number;
  unassignedCount: number;
}
