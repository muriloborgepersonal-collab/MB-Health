
export interface Student {
  id: string;
  name: string;
  plan: string;
  status: 'active' | 'inactive';
  lastWorkout?: string;
  currentRoutine?: string;
  image_url: string;
  email?: string;
  group_type?: 'Online' | 'Presencial';
  birth_date?: string;
  whatsapp?: string;
  gender?: string;
  created_at?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  exercises: Exercise[];
  dateRange?: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  objective: string;
  instructions?: string;
  allowPdf?: boolean;
  showTime?: boolean;
  expireOnEnd?: boolean;
  hideBeforeStart?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  muscle_group?: string;
  category?: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  studentName: string;
  workoutId?: string;
  date: string;
  rating: number; // 1-10
  comment: string;
}

export interface WorkoutNotification {
  id: string;
  studentId: string;
  studentName: string;
  studentImage: string;
  workoutName: string;
  expirationDate: string;
}

export enum NavigationTab {
  Home = 'home',
  Workouts = 'workouts',
  Students = 'students',
  Profile = 'profile'
}
