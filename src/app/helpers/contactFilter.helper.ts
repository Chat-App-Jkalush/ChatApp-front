export function filterContacts(
  contacts: string[],
  searchTerm: string
): string[] {
  if (!searchTerm.trim()) return contacts.slice();
  return contacts.filter((c: string) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
