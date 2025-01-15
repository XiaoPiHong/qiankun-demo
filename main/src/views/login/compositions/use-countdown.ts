const DEFAULT_COUNT = 60;

export default function (defaultCount = DEFAULT_COUNT) {
  const timer = ref<any>(null);
  const count = ref(defaultCount);
  const active = computed(() => timer.value !== null);

  const start = () => {
    timer.value = setTimeout(() => {
      count.value--;
      if (count.value <= 0) {
        stop();
      } else {
        start();
      }
    }, 1000);
  };

  const stop = () => {
    if (active) {
      clearTimeout(timer.value);
      timer.value = null;
    }
  };

  const restart = (initCount?) => {
    stop();
    count.value = initCount ?? defaultCount;
    start();
  };

  return { count, active, start, stop, restart };
}
