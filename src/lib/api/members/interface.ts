export interface Member {
  id: number;
  fellowshipId: number;
  name: string;
  gender: string;
  email: string;
}

export interface CreateMemberRequest {
  name: string;
  gender: string;
  email: string;
  fellowshipId: number;
}

export interface UpdateMemberRequest extends CreateMemberRequest {}
