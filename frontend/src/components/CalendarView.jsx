import React, { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday,
  addMonths, subMonths, isPast, startOfDay,
} from 'date-fns';

const CalendarView = ({ selectedDate, onDateSelect, bookedDates = [], minDate, maxDate }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const isBooked = (day) => bookedDates.some((d) => isSameDay(new Date(d), day));
  const isDisabled = (day) => {
    const today = startOfDay(new Date());
    if (isPast(day) && !isToday(day)) return true;
    if (minDate && day < new Date(minDate)) return true;
    if (maxDate && day > new Date(maxDate)) return true;
    return false;
  };
  const isSelected = (day) => selectedDate && isSameDay(day, new Date(selectedDate));

  const prevMonth = () => setViewDate(subMonths(viewDate, 1));
  const nextMonth = () => setViewDate(addMonths(viewDate, 1));

  const handleDayClick = (day) => {
    if (!isDisabled(day) && isSameMonth(day, viewDate)) {
      onDateSelect(format(day, 'yyyy-MM-dd'));
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      userSelect: 'none',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.color = 'var(--accent-green)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
        >
          ←
        </button>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          letterSpacing: '0.05em',
          color: 'var(--text-primary)',
        }}>
          {format(viewDate, 'MMMM yyyy').toUpperCase()}
        </span>
        <button
          onClick={nextMonth}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.color = 'var(--accent-green)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
        >
          →
        </button>
      </div>

      {/* Week days */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        marginBottom: '8px',
      }}>
        {weekDays.map((d) => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            padding: '4px',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
      }}>
        {days.map((day, idx) => {
          const inMonth = isSameMonth(day, viewDate);
          const today = isToday(day);
          const selected = isSelected(day);
          const disabled = isDisabled(day) || !inMonth;
          const booked = isBooked(day) && inMonth;

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(day)}
              style={{
                textAlign: 'center',
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: selected ? '700' : today ? '600' : '400',
                cursor: disabled ? 'default' : 'pointer',
                opacity: !inMonth ? 0.2 : disabled ? 0.4 : 1,
                color: selected
                  ? '#080e1a'
                  : today
                  ? 'var(--accent-green)'
                  : booked
                  ? 'var(--accent-amber)'
                  : 'var(--text-primary)',
                background: selected
                  ? 'var(--accent-green)'
                  : today && !selected
                  ? 'var(--accent-green-glow)'
                  : 'transparent',
                border: today && !selected
                  ? '1px solid var(--border-accent)'
                  : booked
                  ? '1px solid rgba(255,171,0,0.3)'
                  : '1px solid transparent',
                transition: 'all var(--transition)',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!disabled && !selected) {
                  e.currentTarget.style.background = 'var(--accent-green-glow)';
                  e.currentTarget.style.borderColor = 'var(--border-accent)';
                }
              }}
              onMouseLeave={e => {
                if (!disabled && !selected) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = today ? 'var(--border-accent)' : booked ? 'rgba(255,171,0,0.3)' : 'transparent';
                }
              }}
            >
              {format(day, 'd')}
              {booked && !selected && (
                <div style={{
                  position: 'absolute',
                  bottom: '3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--accent-amber)',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        {[
          { color: 'var(--accent-green)', label: 'Selected' },
          { color: 'rgba(0,230,118,0.3)', label: 'Today' },
          { color: 'var(--accent-amber)', label: 'Booked' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;