export interface Hostel {
  id: string;
  name: string;
  location: string;
  capacity: string;
  remainingCapacity: string;
  gender: string;
}

export interface CreateHostelRequest {
  name: string;
  location: string;
  capacity: number | string;
  remainingCapacity: number | string;
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
