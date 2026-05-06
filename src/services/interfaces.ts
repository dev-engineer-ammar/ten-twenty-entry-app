export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface Timesheet {
  id: number;
  weekNumber: number;
  startDate: string; 
  endDate: string; 
  status: TimesheetStatus;
  totalHours: number;
  targetHours: number;
}

export interface Entry {
  id: number;
  timesheetId: number;
  date: string; 
  taskName: string;
  hours: number;
  projectName: string;
  typeOfWork: string;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
}

export const TYPES_OF_WORK = ["Bug fixes", "Development", "Design", "Testing", "Meeting", "Research"];







