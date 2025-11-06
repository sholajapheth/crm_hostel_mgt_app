export interface User {
  id: string;
  name: string;
  gender: "Male" | "Female";
  state: string;
  zone: string;
  fellowship: string;
  email: string;
  hostelAssigned: boolean;
  hostelName?: string;
}

export interface Hostel {
  id: string;
  name: string;
  gender: "Male" | "Female";
  zone: string;
  capacity: number;
  occupied: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    gender: "Male",
    state: "Lagos",
    zone: "South West",
    fellowship: "Leadership Track A",
    email: "john.doe@email.com",
    hostelAssigned: true,
    hostelName: "Victory Hall",
  },
  {
    id: "2",
    name: "Jane Smith",
    gender: "Female",
    state: "Abuja",
    zone: "North Central",
    fellowship: "Leadership Track B",
    email: "jane.smith@email.com",
    hostelAssigned: true,
    hostelName: "Grace Hostel",
  },
  {
    id: "3",
    name: "Michael Johnson",
    gender: "Male",
    state: "Kano",
    zone: "North West",
    fellowship: "Leadership Track A",
    email: "michael.j@email.com",
    hostelAssigned: false,
  },
  {
    id: "4",
    name: "Sarah Williams",
    gender: "Female",
    state: "Rivers",
    zone: "South South",
    fellowship: "Leadership Track C",
    email: "sarah.w@email.com",
    hostelAssigned: true,
    hostelName: "Faith Lodge",
  },
  {
    id: "5",
    name: "David Brown",
    gender: "Male",
    state: "Enugu",
    zone: "South East",
    fellowship: "Leadership Track B",
    email: "david.b@email.com",
    hostelAssigned: false,
  },
  {
    id: "6",
    name: "Emily Davis",
    gender: "Female",
    state: "Oyo",
    zone: "South West",
    fellowship: "Leadership Track A",
    email: "emily.d@email.com",
    hostelAssigned: true,
    hostelName: "Hope Residence",
  },
  {
    id: "7",
    name: "James Wilson",
    gender: "Male",
    state: "Kaduna",
    zone: "North West",
    fellowship: "Leadership Track C",
    email: "james.w@email.com",
    hostelAssigned: false,
  },
  {
    id: "8",
    name: "Olivia Martinez",
    gender: "Female",
    state: "Delta",
    zone: "South South",
    fellowship: "Leadership Track B",
    email: "olivia.m@email.com",
    hostelAssigned: false,
  },
];

export const mockHostels: Hostel[] = [
  {
    id: "h1",
    name: "Victory Hall",
    gender: "Male",
    zone: "South West",
    capacity: 100,
    occupied: 78,
  },
  {
    id: "h2",
    name: "Grace Hostel",
    gender: "Female",
    zone: "North Central",
    capacity: 120,
    occupied: 95,
  },
  {
    id: "h3",
    name: "Faith Lodge",
    gender: "Female",
    zone: "South South",
    capacity: 80,
    occupied: 62,
  },
  {
    id: "h4",
    name: "Hope Residence",
    gender: "Female",
    zone: "South West",
    capacity: 90,
    occupied: 71,
  },
  {
    id: "h5",
    name: "Peace Quarters",
    gender: "Male",
    zone: "North West",
    capacity: 110,
    occupied: 88,
  },
  {
    id: "h6",
    name: "Unity Hostel",
    gender: "Male",
    zone: "South East",
    capacity: 100,
    occupied: 45,
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Welcome to Leadership Program 2025",
    message: "We are excited to have you join our leadership training program. Orientation begins on Monday.",
    createdAt: "2025-11-05T10:30:00",
    createdBy: "Admin User",
  },
  {
    id: "a2",
    title: "Hostel Allocation Update",
    message: "All participants must complete their profile by Friday to be eligible for hostel allocation.",
    createdAt: "2025-11-04T14:20:00",
    createdBy: "Admin User",
  },
  {
    id: "a3",
    title: "Important: Zone Capacity Limits",
    message: "Please note that each zone has a maximum capacity of 500 participants. Allocations are on a first-come, first-served basis.",
    createdAt: "2025-11-03T09:15:00",
    createdBy: "Admin User",
  },
];

export const zones = ["South West", "South East", "South South", "North West", "North Central", "North East"];
export const states = ["Lagos", "Abuja", "Kano", "Rivers", "Enugu", "Oyo", "Kaduna", "Delta"];
export const fellowships = ["Leadership Track A", "Leadership Track B", "Leadership Track C"];
