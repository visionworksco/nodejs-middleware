const wait = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const TimeoutUtils = {
  wait,
};
