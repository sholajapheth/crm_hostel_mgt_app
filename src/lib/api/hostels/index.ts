export type {
  Hostel,
  CreateHostelRequest,
  UpdateHostelRequest,
  AssignHostelRequest,
  AssignAllHostelsResponse,
  ManualAssignHostelRequest,
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
  useManualAssignHostel,
} from "./mutations";
