// Announcement entity
export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

// Request interfaces
export interface CreateAnnouncementRequest {
  title: string;
  message: string;
}

export interface UpdateAnnouncementRequest {
  title: string;
  message: string;
}

// Response interfaces
export interface AnnouncementsResponse extends Array<Announcement> {}

export interface AnnouncementResponse extends Announcement {}

