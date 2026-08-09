export function getDefaultDate(itemDate?: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (itemDate) {
    const parsed = new Date(itemDate);
    if (parsed >= today) return parsed.toISOString().split("T")[0]!;
  }

  const future = new Date();
  future.setDate(future.getDate() + 7);
  return future.toISOString().split("T")[0]!;
}

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0]!;
}
