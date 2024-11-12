import { Lesson } from './lib/models';

export type RootStackParamList = {
  MainTabs: undefined;
  BlogDetail: { slug: string };
  CourseDetail: { slug: string };
  ResumeCourse: { lesson: (Lesson | undefined)[] };
  CourseList: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Blogs: undefined;
  Learnings: undefined;
  Profile: undefined;
};
