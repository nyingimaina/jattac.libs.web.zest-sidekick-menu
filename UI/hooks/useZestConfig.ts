import { useZestSidekickConfig } from "../context/ZestSidekickConfigContext";
import { ZestSidekickCustomProps } from "../SidekickMenu/types";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepMerge = <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
  const result: Record<string, unknown> = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = (source as Record<string, unknown>)[key];
    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  });

  return result as T;
};

export const useZestConfig = (
  localZestProps?: ZestSidekickCustomProps
): ZestSidekickCustomProps => {
  const { defaultProps } = useZestSidekickConfig();
  return deepMerge(deepMerge({}, defaultProps || {}), localZestProps || {});
};
