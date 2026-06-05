import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { bookingService } from '../services/bookingService.js';
import api from '../services/api.js';
import {
  generateTimeSlots, formatTime, calcHours,
  formatCurrency, formatDate, getMinDate, getMaxDate,
} from '../utils/dateUtils.js';
import { validators } from '../utils/validation.js';
import CalendarView from './CalendarView.jsx';
import Loader from './Loader.jsx';
import toast from 'react-hot-toast';

const BookingForm = ({ turf }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const turfId = turf?._id || turf?.id;
  const timeSlots = generateTimeSlots(turf.openTime, turf.closeTime, 1);

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot(null);
      bookingService.getBookedSlots(turfId, selectedDate)
        .then(setBookedSlots)
        .catch(() => setBookedSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, turfId]);

  const isSlotBooked = (slot) =>
    bookedSlots.some(b =>
      (slot.start >= b.startTime && slot.start < b.endTime) ||
      (slot.end > b.startTime && slot.end <= b.endTime)
    );

  const isSlotPast = (slot) => {
    if (!selectedDate) return false;
    const now = new Date();
    const [h] = slot.start.split(':').map(Number);
    const d = new Date(selectedDate);
    d.setHours(h, 0, 0, 0);
    return d < now;
  };

  const hours = selectedSlot ? calcHours(selectedSlot.start, selectedSlot.end) : 0;
  const total = hours * turf.pricePerHour;

  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    const emailErr = validators.email(form.email);
    if (emailErr) e.email = emailErr;
    const phoneErr = validators.phone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1Next = () => {
    if (!selectedDate) { toast.error('Please select a date'); return; }
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }
    if (!isAuthenticated) { toast.error('Please login to continue'); navigate('/login'); return; }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (validateStep2()) setStep(3);
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway');
        setSubmitting(false);
        return;
      }

      // Create order on backend
      const orderData = await api.post('/payment/create-order', {
        turfId,
        hours,
      });

      // Open Razorpay popup
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: 'INR',
        name: 'TurfPro',
        description: `Booking - ${turf.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#00e676' },
        handler: async (response) => {
          try {
            // Verify payment and create booking
            const result = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              turfId,
              date: selectedDate,
              startTime: selectedSlot.start,
              endTime: selectedSlot.end,
              hours,
              userPhone: form.phone,
              paymentMethod: 'UPI',
              notes: form.notes,
            });
            toast.success('Payment successful! Booking confirmed 🎉');
            navigate('/dashboard', { state: { newBooking: result.booking } });
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setSubmitting(false);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setSubmitting(false);
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  return (
    <div>
      <style>{`
        .booking-steps { display:flex; align-items:center; gap:0; margin-bottom:32px; }
        .step-item { display:flex; align-items:center; gap:8px; flex:1; }
        .step-circle { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; transition:all var(--transition); }
        .step-circle.active { background:var(--accent-green); color:#080e1a; }
        .step-circle.done { background:rgba(0,230,118,0.15); color:var(--accent-green); border:1px solid var(--accent-green); }
        .step-circle.inactive { background:var(--bg-card-hover); color:var(--text-muted); border:1px solid var(--border); }
        .step-line { flex:1; height:1px; background:var(--border); margin:0 8px; }
        .step-line.done { background:var(--accent-green); }
        .time-slot-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:8px; }
        .time-slot-btn { padding:10px 8px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg-card-hover); color:var(--text-secondary); font-size:13px; font-weight:500; cursor:pointer; transition:all var(--transition); text-align:center; font-family:var(--font-body); }
        .time-slot-btn:hover:not(:disabled) { border-color:var(--accent-green); color:var(--accent-green); background:var(--accent-green-glow); }
        .time-slot-btn.selected { background:var(--accent-green); border-color:var(--accent-green); color:#080e1a; font-weight:700; }
        .time-slot-btn:disabled { opacity:0.4; cursor:not-allowed; text-decoration:line-through; }
        .form-error { font-size:12px; color:var(--accent-red); margin-top:4px; }
        .summary-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; }
        .summary-row:last-child { border-bottom:none; }
      `}</style>

      {/* Step Indicator */}
      <div className="booking-steps">
        {['Date & Time', 'Your Info', 'Pay'].map((label, i) => {
          const num = i + 1;
          const status = step > num ? 'done' : step === num ? 'active' : 'inactive';
          return (
            <React.Fragment key={label}>
              {i > 0 && <div className={`step-line ${step > i ? 'done' : ''}`} />}
              <div className="step-item">
                <div className={`step-circle ${status}`}>
                  {status === 'done' ? '✓' : num}
                </div>
                <span style={{ fontSize:'13px', fontWeight:'600', color: status === 'inactive' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1 — Date & Time */}
      {step === 1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'24px', animation:'fadeInUp 0.3s ease' }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', marginBottom:'16px', letterSpacing:'0.03em' }}>SELECT DATE</h3>
            <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} minDate={getMinDate()} maxDate={getMaxDate()} />
          </div>

          {selectedDate && (
            <div style={{ animation:'fadeInUp 0.3s ease' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', marginBottom:'16px', letterSpacing:'0.03em' }}>SELECT TIME SLOT</h3>
              {loadingSlots ? <Loader size="sm" text="Checking availability..." /> : (
                <div className="time-slot-grid">
                  {timeSlots.map(slot => {
                    const booked = isSlotBooked(slot);
                    const past = isSlotPast(slot);
                    const sel = selectedSlot?.start === slot.start;
                    return (
                      <button key={slot.start} className={`time-slot-btn ${sel ? 'selected' : ''}`}
                        disabled={booked || past} onClick={() => setSelectedSlot(sel ? null : slot)}>
                        {formatTime(slot.start)}
                        {booked && <div style={{ fontSize:'10px', marginTop:'2px', opacity:0.7 }}>Booked</div>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <div style={{ background:'var(--accent-green-glow)', border:'1px solid var(--border-accent)', borderRadius:'var(--radius)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', animation:'fadeInUp 0.2s ease' }}>
              <div>
                <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'4px' }}>Selected Slot</div>
                <div style={{ fontWeight:'700', fontSize:'16px' }}>{formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)} · {formatDate(selectedDate)}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'4px' }}>{hours}h × {formatCurrency(turf.pricePerHour)}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', color:'var(--accent-green)' }}>{formatCurrency(total)}</div>
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-lg" onClick={handleStep1Next} disabled={!selectedDate || !selectedSlot}>
            Continue →
          </button>
        </div>
      )}

      {/* STEP 2 — User Details */}
      {step === 2 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'20px', animation:'fadeInUp 0.3s ease' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', letterSpacing:'0.03em' }}>YOUR DETAILS</h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" value={form.name} onChange={inputChange} className="form-input" placeholder="Enter your full name" />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={inputChange} className="form-input" placeholder="your@email.com" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={inputChange} className="form-input" placeholder="+91 98765 43210" />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Special Notes (Optional)</label>
            <textarea name="notes" value={form.notes} onChange={inputChange} className="form-input" rows={3} placeholder="Any special requirements..." style={{ resize:'vertical' }} />
          </div>

          <div style={{ display:'flex', gap:'12px' }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary btn-lg" onClick={handleStep2Next} style={{ flex:1 }}>Review & Pay →</button>
          </div>
        </div>
      )}

      {/* STEP 3 — Payment */}
      {step === 3 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'24px', animation:'fadeInUp 0.3s ease' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', letterSpacing:'0.03em' }}>CONFIRM & PAY</h3>

          <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', background:'var(--accent-green-glow)', borderBottom:'1px solid var(--border-accent)' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.04em', color:'var(--accent-green)' }}>BOOKING SUMMARY</div>
            </div>
            <div style={{ padding:'20px' }}>
              {[
                { label:'Turf', value: turf.name },
                { label:'Sport', value: turf.sport },
                { label:'Date', value: formatDate(selectedDate) },
                { label:'Time', value: `${formatTime(selectedSlot?.start)} – ${formatTime(selectedSlot?.end)}` },
                { label:'Duration', value: `${hours} hour${hours > 1 ? 's' : ''}` },
                { label:'Name', value: form.name },
                { label:'Phone', value: form.phone },
              ].map(({ label, value }) => (
                <div key={label} className="summary-row">
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight:'600' }}>{value}</span>
                </div>
              ))}
              <div className="summary-row" style={{ borderBottom:'none', paddingTop:'16px', marginTop:'8px', borderTop:'2px solid var(--border)' }}>
                <span style={{ fontWeight:'700', fontSize:'16px' }}>Total Amount</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'28px', color:'var(--accent-green)' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Razorpay supported payments */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'8px' }}>Secured by</div>
            <div style={{ fontWeight:'700', fontSize:'16px', color:'var(--text-primary)', marginBottom:'8px' }}>Razorpay</div>
            <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' }}>
              {['UPI', 'Card', 'Net Banking', 'Wallet'].map(m => (
                <span key={m} className="chip" style={{ fontSize:'12px' }}>{m}</span>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', gap:'12px' }}>
            <button className="btn btn-outline" onClick={() => setStep(2)} disabled={submitting}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handlePayment}
              disabled={submitting}
              style={{ flex:1, justifyContent:'center' }}
            >
              {submitting ? 'Processing...' : `Pay ${formatCurrency(total)} →`}
            </button>
          </div>

          <p style={{ fontSize:'12px', color:'var(--text-muted)', textAlign:'center', lineHeight:'1.6' }}>
            🔒 Your payment is secured by Razorpay. Free cancellation up to 24 hours before your slot.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
