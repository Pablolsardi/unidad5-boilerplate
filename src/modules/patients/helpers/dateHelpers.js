const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const MONTH_NAMES = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];

// usamos el parse porq js lo toma como UTC y el back nos da fechas sim hora, si usamos el new Date directo el calendario nos mostraria los turnos un dia antes.
function parseDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function toIsoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function startOfWeek(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay(); // 0 = domingo, 1 = lunes, ...
  const diff = day === 0 ? -6 : 1 - day;

  return addDays(result, diff);
}

function getWeekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => toIsoDate(addDays(weekStart, i)));
}

// '2026-11-24' → 'martes, 24 de noviembre de 2026'
function formatLongDate(isoDate) {
  return parseDate(isoDate).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6);

  return `${weekStart.getDate()} ${MONTH_NAMES[weekStart.getMonth()]} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`;
}

function getDayName(isoDate) {
  return DAY_NAMES[parseDate(isoDate).getDay()];
}

function getMonthName(isoDate) {
  return MONTH_NAMES[parseDate(isoDate).getMonth()];
}

function isPastSlot(slot, now = new Date()) {
  const [hours, minutes] = slot.startTime.split(':').map(Number);
  const slotStart = parseDate(slot.date);

  slotStart.setHours(hours, minutes, 0, 0);

  return slotStart <= now;
}

function groupSlotsByDate(slots) {
  return slots.reduce((groups, slot) => {
    groups[slot.date] = [...(groups[slot.date] ?? []), slot];

    return groups;
  }, {});
}

export {
  parseDate,
  toIsoDate,
  addDays,
  startOfWeek,
  getWeekDates,
  formatLongDate,
  formatWeekRange,
  getDayName,
  getMonthName,
  isPastSlot,
  groupSlotsByDate,
};
