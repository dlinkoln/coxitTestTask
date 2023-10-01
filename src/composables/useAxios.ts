import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

export function useAxios<T>(
  url: string,
  interval?: number,
  resetLoading: boolean = false
) {
  const data = shallowRef<T | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  let intervalId: number | undefined;

  const fetch = async () => {
    if (!resetLoading) {
      isLoading.value = true;
    }
    try {
      const response = await axios.get<T>(url);
      data.value = response.data;
      error.value = null;
    } catch (err: any) {
      data.value = null;
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetch();
    if (interval) {
      intervalId = window.setInterval(fetch, interval);
    }
  });

  onUnmounted(() => {
    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
    }
  });

  return { data, error, isLoading };
}
