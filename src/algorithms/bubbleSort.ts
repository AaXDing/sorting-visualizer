import type { Bar } from "../components/SortingVisualizer"

export function bubbleSortSteps(
  array: Bar[],
  COLOR_DEFAULT: string,
  COLOR_COMPARE: string,
  COLOR_SORTED: string
): Bar[][] {
  const steps: Bar[][] = [];
  const arr = [...array];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Create a copy of the current state
      const currentState = arr.map((bar, index) => ({
        ...bar,
        color: index === j || index === j + 1 ? COLOR_COMPARE : COLOR_DEFAULT,
      }));
      steps.push(currentState);

      if (arr[j].value > arr[j + 1].value) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  // Add final sorted state
  steps.push(arr.map(bar => ({ ...bar, color: COLOR_SORTED })));
  return steps;
} 