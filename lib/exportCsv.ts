/**
 * Export CSV générique — repris de la logique d'échappement et de
 * téléchargement de admin-dashboard.html d'origine (exportToCSV()),
 * avec une différence volontaire : l'original scrapait le texte des
 * lignes <td> actuellement affichées (donc seulement la page en cours
 * après filtre/pagination côté client). Ici on part directement des
 * données typées en mémoire (déjà chargées via react-query), donc
 * l'export couvre TOUTES les lignes filtrées, pas seulement la page
 * visible à l'écran.
 */
export function exportToCsv(filename: string, headers: string[], rows: string[][]): void {
  const escapeCell = (cell: string) => {
    if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  let csvContent = headers.map(escapeCell).join(",") + "\n";
  rows.forEach((row) => {
    csvContent += row.map(escapeCell).join(",") + "\n";
  });

  // Le BOM UTF-8 (\uFEFF) évite qu'Excel affiche les accents mal encodés.
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
