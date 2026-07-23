import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useState, useEffect, useRef } from 'react';

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

  useEffect(() => {
    // Generate dates: 15 days ago to 30 days in future
    const dates = [];
    const today = new Date();
    for (let i = -15; i <= 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    setCalendarDays(dates);
  }, []);

  useEffect(() => {
    // Center the active date on load
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.active-day');
      if (activeEl) {
        // slight timeout ensures rendering is complete
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 100);
      }
    }
  }, [calendarDays]); // Run after days are populated

  const formatDayName = (date) => {
    const names = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return names[date.getDay()];
  };

  const formatTitleDate = (date) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '120px' }}>
        
        {/* Title */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary-blue)', marginBottom: '1.2rem' }}>
          {formatTitleDate(selectedDate)}
        </h2>

        {/* Dynamic Date Selector */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          
          {/* Static Track Line */}
          <div style={{ position: 'absolute', bottom: '2px', left: 0, right: 0, height: '2px', backgroundColor: '#93C5FD', zIndex: 1, borderRadius: '2px' }}></div>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="hide-scroll" 
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              scrollbarWidth: 'none', 
              paddingBottom: '8px', 
              position: 'relative', 
              zIndex: 2,
              scrollBehavior: 'smooth'
            }}>
            {calendarDays.map((date, idx) => {
              const isActive = date.toDateString() === selectedDate.toDateString();
              return (
                <div 
                  key={idx} 
                  className={isActive ? 'active-day' : ''}
                  onClick={() => setSelectedDate(date)}
                  style={{ 
                    backgroundColor: isActive ? 'var(--primary-blue)' : '#EAECEF',
                    color: isActive ? 'white' : 'var(--secondary-blue)',
                    borderRadius: '12px',
                    padding: '0.6rem 0.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '45px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 10px rgba(66, 133, 244, 0.3)' : 'none',
                    position: 'relative'
                  }}>
                  <span style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>{formatDayName(date)}</span>
                  <span style={{ fontSize: '1.2rem' }}>{date.getDate()}</span>

                  {/* Active Blue Indicator mapping to the bottom track */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-9px', // Reach down to cover the track line
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
          
          {/* Custom Calendário button at bottom right */}
          <button style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: 'var(--secondary-blue)',
            color: 'white',
            padding: '0.9rem 1.8rem',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            zIndex: 10,
            boxShadow: 'var(--shadow)',
            cursor: 'pointer'
          }}>
            CALENDÁRIO
          </button>

          {/* Time Labels */}
          <div style={{ width: '3.5rem', display: 'flex', flexDirection: 'column' }}>
            {hours.map((hour, idx) => (
              <div key={idx} style={{ 
                height: '45px', 
                fontSize: '0.75rem', 
                color: '#111', 
                fontWeight: 500 
              }}>
                {hour}
              </div>
            ))}
          </div>
          
          {/* Vertical Line */}
          <div style={{ 
            position: 'absolute', 
            left: '3.8rem', 
            top: '8px', 
            bottom: '20px', 
            width: '1.5px', 
            backgroundColor: '#000' 
          }}></div>
          
          {/* Events Container */}
          <div style={{ flex: 1, position: 'relative', marginLeft: '1.5rem' }}>
             
             {entries
               .filter(e => {
                 if (!e.date) return false;
                 
                 // Get YYYY-MM-DD of the selected date in local time
                 const pad = (n) => n.toString().padStart(2, '0');
                 const selectedDateStr = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth()+1)}-${pad(selectedDate.getDate())}`;
                 
                 // e.date comes from MongoDB/Input usually as "YYYY-MM-DDTHH:mm"
                 return e.date.startsWith(selectedDateStr);
               })
               .map((entry, idx) => {
                 let time = '12:00';
                 if (entry.date.includes('T')) time = entry.date.split('T')[1].substring(0, 5);
                 else if (entry.date.includes(' ')) time = entry.date.split(' ')[1].substring(0, 5);
                 
                 const hourInt = parseInt(time.split(':')[0], 10);
                 // Mapping 08:00 to index 0, so subtract 8.
                 let topIndex = hourInt - 8;
                 if (topIndex < 0) topIndex = 0;
                 if (topIndex > 15) topIndex = 15;

                 const isReuniao = entry.category === 'Reunião';
                 const color = isReuniao ? 'var(--secondary-blue)' : (entry.category === 'Visita Técnica' ? 'var(--primary-blue)' : 'var(--danger-red)');
                 const bgColor = isReuniao ? '#F3F4F6' : (entry.category === 'Visita Técnica' ? '#EFF6FF' : '#FDF2F2');
                 const title = entry.category;
                 const desc = entry.location ? `${entry.location} - ${entry.participants}` : entry.text;

                 return (
                   <div key={entry._id || idx} style={{ 
                     position: 'absolute', 
                     top: `${topIndex * 45}px`,
                     height: '90px',
                     left: 0, right: 0, 
                     backgroundColor: 'white', 
                     borderRadius: '16px',
                     boxShadow: '0 2px 10px rgba(0,0,0,0.03)', 
                     padding: '1rem',
                     zIndex: 5
                   }}>
                      {/* Dot */}
                      <div style={{ 
                        position: 'absolute', 
                        left: '-1.45rem',
                        top: '0px', 
                        width: '12px', height: '12px', 
                        borderRadius: '50%', backgroundColor: color,
                        border: '2px solid var(--bg-color)',
                        zIndex: 2
                      }}></div>
                      
                      {/* Content */}
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--secondary-blue)' }}>{time} - {title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', marginTop: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</p>
                      
                      {/* Avatars */}
                      <div style={{ position: 'absolute', bottom: '0.8rem', right: '1rem', display: 'flex' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${color}`, backgroundColor: bgColor, zIndex: 1 }}></div>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${color}`, backgroundColor: bgColor, marginLeft: '-8px', zIndex: 2 }}></div>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: color, marginLeft: '-8px', zIndex: 3 }}></div>
                      </div>
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
