function padNumber(n) {
  return `${n}`.padStart(2, "0");
}

export default function formatDateInput(date) {
  const d = new Date(date);
  const day = padNumber(d.getDate());
  const month = padNumber(d.getMonth() + 1);
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
