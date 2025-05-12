import type { Bar } from "../components/SortingVisualizer";

export function mergeSortSteps(
  array: Bar[],
  COLOR_DEFAULT: string,
  COLOR_COMPARE: string,
  COLOR_SORTED: string
): Bar[][] {
  const COLOR_LEFT = '#3b82f6'; // blue
  const COLOR_RIGHT = '#f59e42'; // orange
  const COLOR_MERGED = '#a3e635'; // lime-400

  const steps: Bar[][] = [];
  const arr = array.map(bar => ({ ...bar }));

  function mergeSort(start: number, end: number) {
    if (end - start <= 1) return;
    const mid = Math.floor((start + end) / 2);
    mergeSort(start, mid);
    mergeSort(mid, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    let left = arr.slice(start, mid);
    let right = arr.slice(mid, end);
    let i = start;
    let l = 0, r = 0;
    // Highlight left and right subarrays
    steps.push(arr.map((bar, idx) => ({
      ...bar,
      color: idx >= start && idx < mid ? COLOR_LEFT : idx >= mid && idx < end ? COLOR_RIGHT : COLOR_DEFAULT,
    })));
    while (l < left.length && r < right.length) {
      // Highlight compared bars
      const currentState = arr.map((bar, idx) => ({
        ...bar,
        color:
          idx === i ? COLOR_COMPARE :
          idx >= start && idx < mid ? COLOR_LEFT :
          idx >= mid && idx < end ? COLOR_RIGHT :
          COLOR_DEFAULT,
      }));
      steps.push(currentState);
      if (left[l].value <= right[r].value) {
        arr[i] = { ...left[l], color: COLOR_MERGED };
        l++;
      } else {
        arr[i] = { ...right[r], color: COLOR_MERGED };
        r++;
      }
      i++;
    }
    while (l < left.length) {
      arr[i] = { ...left[l], color: COLOR_MERGED };
      i++; l++;
    }
    while (r < right.length) {
      arr[i] = { ...right[r], color: COLOR_MERGED };
      i++; r++;
    }
    // After merge, mark merged section as merged color
    steps.push(arr.map((bar, idx) => ({
      ...bar,
      color: (idx >= start && idx < end) ? COLOR_MERGED : COLOR_DEFAULT,
    })));
    // Reset merged section to default
    steps.push(arr.map((bar, idx) => ({
      ...bar,
      color: (idx >= start && idx < end) ? COLOR_DEFAULT : bar.color,
    })));
  }

  mergeSort(0, arr.length);
  // Mark all as sorted at the end
  steps.push(arr.map(bar => ({ ...bar, color: COLOR_SORTED })));
  return steps;
} 