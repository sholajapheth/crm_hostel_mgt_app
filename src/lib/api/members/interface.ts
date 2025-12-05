export interface Member {
  id: string;
  fellowshipId: string;
  name: string;
  gender: string;
  email: string;
}

export interface CreateMemberRequest {
  name: string;
  gender: string;
  email: string;
  fellowshipId: string;
}

export interface UpdateMemberRequest extends CreateMemberRequest {}
