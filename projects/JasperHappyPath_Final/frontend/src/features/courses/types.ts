export type CourseListModel = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  numberOfDays: number;
};

export type CourseCreateModel = Omit<CourseListModel, 'id' | 'instructor'>;
