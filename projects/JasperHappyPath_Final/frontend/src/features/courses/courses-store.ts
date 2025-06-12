import { computed, effect, resource } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { CourseCreateModel, CourseListModel } from './types';

export const CoursesStore = signalStore(
  withState({
    flash: '',
    hasError: false,
  }),
  withProps(() => {
    const coursesResource = resource({
      loader: () =>
        fetch('/api/courses').then(
          (r) => r.json() as Promise<CourseListModel[]>,
        ),
      defaultValue: [],
    });
    return {
      _resource: coursesResource,
    };
  }),
  withComputed((store) => {
    return {
      courses: computed(() => store._resource.value()),
      isLoading: computed(() => store._resource.isLoading()),
      error: computed(() => store._resource.error()),
    };
  }),
  withMethods((store) => {
    return {
      clearFlash: () => patchState(store, { flash: '', hasError: false }),
      delete: async (courseId: string) => {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          patchState(store, {
            flash: 'Failed to delete course',
            hasError: true,
          });
        } else {
          patchState(store, {
            flash: 'Course deleted successfully!',
            hasError: false,
          });
        }
        store._resource.reload();
      },
      assignInstructor: async (courseId: string, instructor: string) => {
        const response = await fetch(`/api/courses/${courseId}/instructor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ instructor }),
        });
        if (!response.ok) {
          patchState(store, {
            flash: 'Failed to assign instructor',
            hasError: true,
          });
        } else {
          patchState(store, {
            flash: `Instructor ${instructor} assigned successfully!`,
            hasError: false,
          });
        }
        store._resource.reload();
      },
      reload: () => store._resource.reload(),
      addCourse: async (course: CourseCreateModel) => {
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(course),
        });
        if (!response.ok) {
          patchState(store, { flash: 'Failed to add course', hasError: true });
        } else {
          patchState(store, {
            flash: `Course ${course.title} added successfully!`,
            hasError: false,
          });
        }
        store._resource.reload();
      },
    };
  }),
  withHooks({
    onInit: (store) => {
      effect(() => {
        if (store.flash()) {
          const timeout = setTimeout(() => {
            patchState(store, { flash: '', hasError: false });
          }, 5000);
          return () => clearTimeout(timeout);
        }
        return () => null;
      });
    },
  }),
);
