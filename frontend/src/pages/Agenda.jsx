import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Calendar as CalendarIcon } from 'lucide-react';

export default function Agenda() {
  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
    '22:00', '23:00'
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [entries, setEntries] = useState([]);
  const scrollRef = useRef(null);

  // Fetch real entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/entries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntries();
  }, []);

  // Generate 60 days around the currently selected date
  useEffect(() => {
    const dates = [];
    // Go 15 days back from selected date and 45 days forward
    for (let i = -15; i <= 45; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      dates.push(d);
    }
    setCalendarDays(dates);
  }, [selectedDate]);

  // Center the active date whenever the days regenerate
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.active-day');
      if (activeEl) {
        // slight timeout ensures rendering is complete
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 100);
      }
    }
  }, [calendarDays]);

  const formatDayName = (date) => {
    const names = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return names[date.getDay()];
  };

  const getMonthAndYear = (date) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDatePick = (e) => {
    if (e.target.value) {
      // The input date is YYYY-MM-DD. Need to parse locally so timezone doesn't shift it a day back.
      const [y, m, d] = e.target.value.split('-');
      setSelectedDate(new Date(y, m - 1, d));
    }
  };

  // Convert selectedDate to YYYY-MM-DD for the input
  const pad = (n) => n.toString().padStart(2, '0');
  const maxInputDate = "2030-12-31";
  const selectedDateValue = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth()+1)}-${pad(selectedDate.getDate())}`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '120px' }}>
        
        {/* Compact Header with Native Date Picker */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary-blue)', margin: 0 }}>
              {getMonthAndYear(selectedDate)}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 500, marginTop: '2px' }}>
              {formatDayName(selectedDate)}, {selectedDate.getDate()}
            </p>
          </div>
          
          {/* Invisible Native Date Input triggered by Icon */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="native-date-picker" style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              backgroundColor: '#EAECEF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--secondary-blue)' 
            }}>
              <CalendarIcon size={20} />
            </label>
            <input 
              id="native-date-picker"
              type="date"
              value={selectedDateValue}
              onChange={handleDatePick}
              max={maxInputDate}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                left: 0,
                top: 0
              }}
            />
          </div>
        </div>

        {/* Dynamic Date Selector */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          
          {/* Static Track Line */}
          <div style={{ position: 'absolute', bottom: '2px', left: 0, right: 0, height: '2px', backgroundColor: '#E5E7EB', zIndex: 1, borderRadius: '2px' }}></div>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="hide-scroll" 
            style={{ 
              display: 'flex', 
              gap: '0.8rem', 
              overflowX: 'auto', 
              scrollbarWidth: 'none', 
              paddingBottom: '8px', 
              position: 'relative', 
              zIndex: 2,
              scrollBehavior: 'smooth'
            }}>
            {calendarDays.map((date, idx) => {
              const isActive = date.toDateString() === selectedDate.toDateString();
              const dateStr = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
              const hasEvents = entries.some(e => e.date && e.date.startsWith(dateStr));
              
              return (
                <div 
                  key={idx} 
                  className={isActive ? 'active-day' : ''}
                  onClick={() => setSelectedDate(date)}
                  style={{ 
                    backgroundColor: isActive ? 'var(--primary-blue)' : 'transparent',
                    color: isActive ? 'white' : 'var(--secondary-blue)',
                    borderRadius: '12px',
                    padding: '0.5rem 0.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '40px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}>
                  <span style={{ fontSize: '0.7rem', marginBottom: '0.2rem', opacity: isActive ? 1 : 0.6 }}>{formatDayName(date)}</span>
                  <span style={{ fontSize: '1.1rem' }}>{date.getDate()}</span>
                  
                  {/* Event Indicator Dot */}
                  {hasEvents && !isActive && (
                    <div style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: 'var(--danger-red)',
                      borderRadius: '50%',
                      marginTop: '4px'
                    }}></div>
                  )}

                  {/* Active Blue Indicator mapping to the bottom track */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-9px',
                      left: '5%',
                      width: '90%',
                      height: '4px',
                      backgroundColor: 'var(--primary-blue)',
                      borderRadius: '4px'
                    }}></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Agenda Section */}
        <div style={{ position: 'relative', display: 'flex', paddingBottom: '2rem', flex: 1 }}>
          
          {/* Custom Calendário button at bottom right (hidden because we have top calendar now, but keeping if needed or removing it? Let's remove it as requested by compact design) */}

          {/* Time Labels */}
          <div style={{ width: '3.5rem', display: 'flex', flexDirection: 'column' }}>
            {hours.map((hour, idx) => (
              <div key={idx} style={{ 
                height: '45px', 
                fontSize: '0.75rem', 
                color: '#6B7280', 
                fontWeight: 500,
                transform: 'translateY(-6px)' // Align visually with the line
              }}>
                {hour}
              </div>
            ))}
          </div>
          
          {/* Softer Dashed Vertical Line */}
          <div style={{ 
            position: 'absolute', 
            left: '3.8rem', 
            top: '0px', 
            bottom: '20px', 
            width: '0px', 
            borderLeft: '2px dashed #E5E7EB' 
          }}></div>
          
          {/* Events Container */}
          <div style={{ flex: 1, position: 'relative', marginLeft: '1.5rem' }}>
             
             {entries
               .filter(e => {
                 if (!e.date) return false;
                 return e.date.startsWith(selectedDateValue);
               })
               .map((entry, idx) => {
                 let time = '12:00';
                 if (entry.date.includes('T')) time = entry.date.split('T')[1].substring(0, 5);
                 else if (entry.date.includes(' ')) time = entry.date.split(' ')[1].substring(0, 5);
                 
                 const hourInt = parseInt(time.split(':')[0], 10);
                 let topIndex = hourInt - 8;
                 if (topIndex < 0) topIndex = 0;
                 if (topIndex > 15) topIndex = 15;

                 const isReuniao = entry.category === 'Reunião';
                 const color = isReuniao ? 'var(--secondary-blue)' : (entry.category === 'Visita Técnica' ? 'var(--primary-blue)' : 'var(--danger-red)');
                 const title = entry.category;
                 const desc = entry.location ? `${entry.location} - ${entry.participants}` : entry.text;

                 return (
                   <div key={entry._id || idx} style={{ 
                     position: 'absolute', 
                     top: `${topIndex * 45}px`,
                     height: '85px',
                     left: 0, right: 0, 
                     backgroundColor: 'white', 
                     borderRadius: '16px',
                     boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
                     border: '1px solid #F3F4F6',
                     padding: '1rem',
                     zIndex: 5
                   }}>
                      {/* Dot */}
                      <div style={{ 
                        position: 'absolute', 
                        left: '-1.48rem',
                        top: '12px', 
                        width: '14px', height: '14px', 
                        borderRadius: '50%', backgroundColor: color,
                        border: '3px solid var(--bg-color)',
                        zIndex: 2
                      }}></div>
                      
                      {/* Content */}
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--secondary-blue)' }}>{time} - {title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', marginTop: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</p>
                      
                      {/* Options Button */}
                      <button style={{ 
                        position: 'absolute', 
                        bottom: '0.8rem', 
                        right: '0.8rem', 
                        background: 'transparent',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary-blue)'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
                      >
                        <MoreVertical size={20} />
                      </button>
                   </div>
                 );
               })}
          </div>
        </div>

      </main>

      <BottomNav activeTab="agenda" />
    </div>
  );
}
