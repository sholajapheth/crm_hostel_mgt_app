export interface Hostel {
  id: string;
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
  memberId: string;
  hostelId?: number;
}

export interface AssignAllHostelsResponse {
  message: string;
  assignedCount: number;
  unassignedCount: number;
}

export interface ManualAssignHostelRequest {
  memberIds: number[];
  hostelId: string;
}
