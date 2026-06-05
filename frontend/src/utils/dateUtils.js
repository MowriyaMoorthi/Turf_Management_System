// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    today.setHours(0,0,0,0);
    tomorrow.setHours(0,0,0,0);
    date.setHours(0,0,0,0);
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
};

// Format date short
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
};

// Format time HH:MM to 12hr
export const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return hour12 + ':' + m.toString().padStart(2, '0') + ' ' + ampm;
};

// Generate time slots
export const generateTimeSlots = (openTime, closeTime, intervalHours = 1) => {
  const slots = [];
  const [openH] = openTime.split(':').map(Number);
  const [closeH] = closeTime.split(':').map(Number);
  let current = openH;
  while (current + intervalHours <= closeH) {
    const start = current.toString().padStart(2, '0') + ':00';
    const end = (current + intervalHours).toString().padStart(2, '0') + ':00';
    slots.push({ start, end, label: formatTime(start) + ' – ' + formatTime(end) });
    current += intervalHours;
  }
  return slots;
};

// Check if slot is past
export const isSlotPast = (date, startTime) => {
  const now = new Date();
  const [h, m] = startTime.split(':').map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(h, m, 0, 0);
  return slotDate < now;
};

// Get today string YYYY-MM-DD
export const getTodayString = () => new Date().toISOString().split('T')[0];

export const getMinDate = () => getTodayString();

export const getMaxDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

// Calculate hours between two times
export const calcHours = (startTime, endTime) => {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
};

// Format currency INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
};

// Time ago
export const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return formatDateShort(dateStr);
};

// Status config
export const getStatusConfig = (status) => {
  const configs = {
    confirmed: { label: 'Confirmed', class: 'badge-green', color: 'var(--accent-green)' },
    completed:  { label: 'Completed', class: 'badge-amber', color: 'var(--accent-amber)' },
    cancelled:  { label: 'Cancelled', class: 'badge-red',   color: 'var(--accent-red)'   },
    pending:    { label: 'Pending',   class: 'badge-amber', color: 'var(--accent-amber)' },
  };
  return configs[status] || { label: status, class: '', color: 'var(--text-secondary)' };
};
