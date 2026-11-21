import {
  formatWeekRange,
  getDayName,
  getMonthName,
  parseDate,
} from '../helpers/dateHelpers';

function SlotButton({ slot, isSelected, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(slot)}
      className={`w-full py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
        isSelected
          ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
          : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
      }`}
    >
      {slot.startTime}
    </button>
  );
}

function WeekHeader({ weekStart, canGoBack, onChangeWeek }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Semana anterior"
          onClick={() => onChangeWeek(-1)}
          disabled={!canGoBack}
          className="px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <span className="font-bold text-sm sm:text-base text-med-primary-900">
          {formatWeekRange(weekStart)}
        </span>
        <button
          type="button"
          aria-label="Semana siguiente"
          onClick={() => onChangeWeek(1)}
          className="px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs text-med-text-sub">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-med-primary-900" />
          Disponible
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Seleccionado
        </span>
      </div>
    </div>
  );
}

// Calendario semanal de horarios. Desktop: una columna por día.
// Mobile: fila de días + horarios del día elegido.
function WeekSlotsCalendar({
  weekStart,
  weekDates,
  slotsByDate,
  selectedDate,
  onSelectDate,
  selectedSlotId,
  onSelectSlot,
  canGoBack,
  onChangeWeek,
}) {
  const renderSlot = (slot) => (
    <SlotButton
      key={slot.id}
      slot={slot}
      isSelected={slot.id === selectedSlotId}
      onSelect={onSelectSlot}
    />
  );

  const selectedDaySlots = slotsByDate[selectedDate] ?? [];

  return (
    <>
      <WeekHeader
        weekStart={weekStart}
        canGoBack={canGoBack}
        onChangeWeek={onChangeWeek}
      />

      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-7 gap-3 pt-5">
        {weekDates.map((date) => {
          const daySlots = slotsByDate[date] ?? [];

          return (
            <div key={date} className="flex flex-col items-center gap-3">
              <div className="text-center">
                <span className="text-[11px] font-bold text-med-text-sub uppercase">
                  {getDayName(date)}
                </span>
                <p className="text-xl font-bold text-med-primary-900 leading-tight">
                  {parseDate(date).getDate()}
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                {daySlots.length > 0 ? (
                  daySlots.map(renderSlot)
                ) : (
                  <p className="py-6 text-center text-[11px] text-med-text-muted">
                    Sin turnos
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="block sm:hidden pt-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {weekDates.map((date) => {
            const hasSlots = slotsByDate[date]?.length > 0;
            const isActive = selectedDate === date;

            return (
              <button
                key={date}
                type="button"
                aria-pressed={isActive}
                disabled={!hasSlots}
                onClick={() => onSelectDate(date)}
                className={`flex-1 min-w-[56px] py-2.5 px-2 rounded-xl text-center border transition-all disabled:opacity-40 ${
                  isActive
                    ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                    : 'bg-white border-med-border text-med-text-main'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase">
                  {getDayName(date)}
                </span>
                <span className="block text-base font-extrabold my-0.5">
                  {parseDate(date).getDate()}
                </span>
                <span className="block text-[10px] uppercase">
                  {getMonthName(date)}
                </span>
              </button>
            );
          })}
        </div>

        {selectedDaySlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {selectedDaySlots.map(renderSlot)}
          </div>
        ) : (
          <p className="p-6 bg-gray-50 border border-med-border rounded-xl text-center text-xs text-med-text-muted">
            No hay turnos esta semana.
          </p>
        )}
      </div>
    </>
  );
}

export default WeekSlotsCalendar;
