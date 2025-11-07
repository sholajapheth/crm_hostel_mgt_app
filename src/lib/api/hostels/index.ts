export type {
  Hostel,
  CreateHostelRequest,
  UpdateHostelRequest,
  AssignHostelRequest,
  AssignAllHostelsResponse,
} from "./interface";

export { httpClient } from "./httpClient";

export {
  hostelKeys,
  useHostels,
  useHostel,
} from "./queries";

export {
  useCreateHostel,
  useUpdateHostel,
  useDeleteHostel,
  useAssignHostel,
  useAssignAllHostels,
} from "./mutations";
