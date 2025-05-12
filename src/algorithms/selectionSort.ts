import type { Bar } from "../components/SortingVisualizer";

export function selectionSortSteps(
  array: Bar[],
  COLOR_DEFAULT: string,
  COLOR_COMPARE: string,
  COLOR_SORTED: string
): Bar[][] {
  const steps: Bar[][] = [];
  const arr = array.map(bar => ({ ...bar }));
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      steps.push(arr.map((bar, idx) => ({
        ...bar,
        color: idx === minIdx || idx === j ? COLOR_COMPARE : COLOR_DEFAULT,
      })));
      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    steps.push(arr.map((bar, idx) => ({
      ...bar,
      color: idx <= i ? COLOR_SORTED : COLOR_DEFAULT,
    })));
  }
  steps.push(arr.map(bar => ({ ...bar, color: COLOR_SORTED })));
  return steps;
} 