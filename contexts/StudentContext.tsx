
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Feedback, WorkoutNotification, Workout } from '../types';
import { supabase } from '../src/lib/supabase';

const MOCK_FEEDBACKS: Feedback[] = [
    { id: '1', studentId: '1', studentName: 'Lucas Silva', date: '2025-01-24T10:00:00', rating: 8, comment: 'Treino muito bom, senti bastante o peitoral.' },
    { id: '2', studentId: '2', studentName: 'Mariana Costa', date: '2025-01-23T18:30:00', rating: 5, comment: 'Senti um pouco de dor no joelho no agachamento.' },
];

const MOCK_NOTIFICATIONS: WorkoutNotification[] = [
    { id: '1', studentId: '1', studentName: 'Lucas Silva', studentImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbD14dCtMIwa7UQIotTrZdvAJytgCtJgvenjgBT99wucDxmjgHpvH61nulDryuCxSb107c3rnzjpcFIvSRsu8_VHCKr37CEIWSMy9KZP6O7hoq_cwQQdYvicBehK5A0j6tjnkEoRSGysfT4kpyf0OdzpW9ETdI_zE2hB22j2hio2ogJ6XEeLj1wefD0TpNxlZ6GHrnF75qDFB-T8KjenemN2IaQbJZECpgdQ7z5fgUWvqRYtC9rMiwkdsllbfhvYCr8pZdT6K_9wsD', workoutName: 'Treino A - Hipertrofia', expirationDate: '2025-01-30' },
    { id: '2', studentId: '3', studentName: 'Roberto Junior', studentImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLyOpYhlTBEvUl42ZcWTCyReN9f-VIKqm3wxSlpyR0HyAY9IIAgkpd2m2Ny-MUHh4T8TJehy1DJnzhXBgFuSmVZ97uMBiIgo8se-2wdb6qTzX9PJppjwSaBN8BPVMkeM_UpNQhasquAowMdX7TBgjhC9pgUR5MmeyEyyRSQO0s9V3thwW4O-nsjhd4EyEVzieqmH27B-UcQLjqnQpq-IwlLlZtgpnjJo8MxKQhzyabxPu4XA2R9MIVONp9QiuJiZmiWvmhMBGVzWuZ', workoutName: 'Treino B - Resistência', expirationDate: '2025-02-01' },
];

interface StudentContextType {
    students: Student[];
    feedbacks: Feedback[];
    notifications: WorkoutNotification[];
    addStudent: (student: Omit<Student, 'id' | 'status' | 'plan' | 'created_at'> & { image_url?: string }) => Promise<void>;
    updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
    addFeedback: (feedback: Omit<Feedback, 'id' | 'date'>) => void;
    addWorkout: (studentId: string, workout: Omit<Workout, 'id' | 'exercises'>) => Promise<string>;
    markNotificationAsRead: (id: string) => void;
    loading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);
    const [notifications, setNotifications] = useState<WorkoutNotification[]>(MOCK_NOTIFICATIONS);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Alunos')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching students:', error);
        } else {
            setStudents(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const addStudent = async (newStudentData: Omit<Student, 'id' | 'status' | 'plan' | 'created_at'> & { image_url?: string }) => {
        const image_url = newStudentData.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(newStudentData.name)}&background=random`;

        const { data, error } = await supabase
            .from('Alunos')
            .insert([{
                ...newStudentData,
                image_url,
                status: 'active',
                plan: 'Sem treino definido'
            }])
            .select();

        if (error) {
            console.error('Error adding student:', error);
            throw error;
        } else if (data) {
            setStudents(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        }
    };

    const updateStudent = async (id: string, updates: Partial<Student>) => {
        const { error } = await supabase
            .from('Alunos')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating student:', error);
            throw error;
        } else {
            setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        }
    };

    const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'date'>) => {
        const newFeedback: Feedback = {
            ...feedbackData,
            id: Date.now().toString(),
            date: new Date().toISOString()
        };
        setFeedbacks(prev => [newFeedback, ...prev]);
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addWorkout = async (studentId: string, workoutData: Omit<Workout, 'id' | 'exercises'>) => {
        const { data, error } = await supabase
            .from('workouts')
            .insert([{
                student_id: studentId,
                name: workoutData.name,
                type: workoutData.type,
                objective: workoutData.objective,
                level: workoutData.level,
                date_range: workoutData.dateRange,
                instructions: workoutData.instructions,
                allow_pdf: workoutData.allowPdf,
                show_time: workoutData.showTime,
                expire_on_end: workoutData.expireOnEnd,
                hide_before_start: workoutData.hideBeforeStart
            }])
            .select();

        if (error) {
            console.error('Error adding workout:', error);
            throw error;
        }

        return data[0].id;
    };

    return (
        <StudentContext.Provider value={{ students, feedbacks, notifications, addStudent, updateStudent, addFeedback, addWorkout, markNotificationAsRead, loading }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => {
    const context = useContext(StudentContext);
    if (context === undefined) {
        throw new Error('useStudent must be used within a StudentProvider');
    }
    return context;
};
