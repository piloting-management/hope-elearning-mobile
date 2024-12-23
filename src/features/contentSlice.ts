import { Category, Course, Subject } from '@/lib/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentState {
  categories: Category[];
  subjects: Subject[];
  courses: Course[];
  searchQuery: string;
}

const initialState: ContentState = {
  categories: [],
  subjects: [],
  courses: [],
  searchQuery: '',
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setSubjects(state, action: PayloadAction<Subject[]>) {
      state.subjects = action.payload;
    },
    setCourses(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setCategories, setSubjects, setCourses, setSearchQuery } =
  contentSlice.actions;

export default contentSlice.reducer;
