import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  getWeekDates,
  groupSlotsByDate,
  parseDate,
  startOfWeek,
} from '../helpers/dateHelpers';

// Estado del calendario semanal: qué semana se ve y qué día está elegido
// (el día elegido solo se usa en la vista mobile).
function useWeekCalendar(slots) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState('');

  // Cuando llegan horarios nuevos, saltamos a la semana del primero disponible
  useEffect(() => {
    if (slots.length === 0) return;

    setWeekStart(startOfWeek(parseDate(slots[0].date)));
    setSelectedDate(slots[0].date);
  }, [slots]);

  const slotsByDate = useMemo(() => groupSlotsByDate(slots), [slots]);
  const weekDates = getWeekDates(weekStart);
  const canGoBack = weekStart > startOfWeek(new Date());

  // direction: -1 semana anterior, 1 semana siguiente
  const changeWeek = (direction) => {
    const newStart = addDays(weekStart, direction * 7);
    const firstDayWithSlots = getWeekDates(newStart).find(
      (date) => slotsByDate[date]?.length > 0
    );

    setWeekStart(newStart);
    setSelectedDate(firstDayWithSlots ?? '');
  };

  return {
    weekStart,
    weekDates,
    slotsByDate,
    selectedDate,
    setSelectedDate,
    canGoBack,
    changeWeek,
  };
}

export default useWeekCalendar;
