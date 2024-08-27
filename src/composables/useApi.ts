import { ref } from 'vue';

export function useApi<T>(endpoint: string, options: RequestInit = {}) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const baseUrl = import.meta.env.VITE_API_BASE;

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      data.value = await response.json();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      isLoading.value = false;
    }
  };

  return { data, error, isLoading, fetchData };
}
