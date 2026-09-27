export const bookDetailAdapter = {
  toProgressRequest: (progress) => ({ progress }),
  toNoteRequest: ({ text, page }) => ({ text: text.trim(), page: page ?? 0 }),
};
