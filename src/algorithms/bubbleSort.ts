import type { Bar } from "../components/SortingVisualizer"

export function bubbleSortSteps(
  array: Bar[],
  COLOR_DEFAULT: string,
  COLOR_COMPARE: string,
  COLOR_SORTED: string
): { bars: Bar[]; line: number }[] {
  const steps: { bars: Bar[]; line: number }[] = [];
  const arr = [...array];

  for (let i = 0; i < arr.length - 1; i++) {
    // Outer loop line
    steps.push({ bars: arr.map(bar => ({ ...bar })), line: 0 });
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Inner loop line
      steps.push({
        bars: arr.map((bar, index) => ({
          ...bar,
          color: index === j || index === j + 1 ? COLOR_COMPARE : COLOR_DEFAULT,
        })),
        line: 1,
      });
      // If condition line
      steps.push({
        bars: arr.map((bar, index) => ({
          ...bar,
          color: index === j || index === j + 1 ? COLOR_COMPARE : COLOR_DEFAULT,
        })),
        line: 2,
      });
      if (arr[j].value > arr[j + 1].value) {
        // Swap line
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          bars: arr.map((bar, index) => ({
            ...bar,
            color: index === j || index === j + 1 ? COLOR_COMPARE : COLOR_DEFAULT,
          })),
          line: 3,
        });
      }
    }
  }

  // Add final sorted state, highlight as done (use last line)
  steps.push({ bars: arr.map(bar => ({ ...bar, color: COLOR_SORTED })), line: 3 });
  return steps;
} 