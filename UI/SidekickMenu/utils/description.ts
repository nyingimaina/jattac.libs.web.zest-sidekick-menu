export const MAX_DESCRIPTION_LENGTH = 40;

export const truncateDescription = (
  description?: string,
  maxLength: number = MAX_DESCRIPTION_LENGTH
): string | undefined => {
  if (!description) return description;
  if (description.length <= maxLength) return description;
  return `${description.slice(0, maxLength - 1)}…`;
};

export const validateDescriptionLength = (itemId: string, description?: string) => {
  if (process.env.NODE_ENV === "production") return;
  if (!description) return;
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    console.warn(
      `[SidekickMenu] Item '${itemId}' has a description longer than ${MAX_DESCRIPTION_LENGTH} characters ` +
        "(it will be truncated with an ellipsis at render time)."
    );
  }
};
