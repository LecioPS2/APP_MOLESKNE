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
  const scrollRef = useRef(null);

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
             
             {/* Event 1 (10:00) */}
             <div style={{ 
               position: 'absolute', 
               top: `${2 * 45}px`, /* 10:00 is index 2 */
               height: '110px',
               left: 0, 
               right: 0, 
               backgroundColor: 'white', 
               borderRadius: '16px',
               boxShadow: '0 2px 10px rgba(0,0,0,0.03)', 
               padding: '1rem',
             }}>
                {/* Dot */}
                <div style={{ 
                  position: 'absolute', 
                  left: '-1.45rem',
                  top: '0px', 
                  width: '12px', height: '12px', 
                  borderRadius: '50%', backgroundColor: 'var(--secondary-blue)',
                  border: '2px solid var(--bg-color)',
                  zIndex: 2
                }}></div>
                
                {/* Avatars */}
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--secondary-blue)', backgroundColor: '#F3F4F6', zIndex: 1 }}></div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--secondary-blue)', backgroundColor: '#F3F4F6', marginLeft: '-8px', zIndex: 2 }}></div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--secondary-blue)', marginLeft: '-8px', zIndex: 3 }}></div>
                </div>
             </div>

             {/* Event 2 (14:00) */}
             <div style={{ 
               position: 'absolute', 
               top: `${6 * 45}px`, /* 14:00 is index 6 */
               height: '110px',
               left: 0, 
               right: 0, 
               backgroundColor: 'white', 
               borderRadius: '16px',
               boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
               padding: '1rem',
             }}>
                {/* Dot */}
                <div style={{ 
                  position: 'absolute', 
                  left: '-1.45rem', 
                  top: '0px', 
                  width: '12px', height: '12px', 
                  borderRadius: '50%', backgroundColor: 'var(--secondary-blue)',
                  border: '2px solid var(--bg-color)',
                  zIndex: 2
                }}></div>

                {/* Avatars */}
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--secondary-blue)', backgroundColor: '#F3F4F6', zIndex: 1 }}></div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--secondary-blue)', backgroundColor: '#F3F4F6', marginLeft: '-8px', zIndex: 2 }}></div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--secondary-blue)', marginLeft: '-8px', zIndex: 3 }}></div>
                </div>
             </div>

             {/* Event 3 (20:00) */}
             <div style={{ 
               position: 'absolute', 
               top: `${12 * 45}px`, /* 20:00 is index 12 */
               height: '110px',
               left: 0, 
               right: 0, 
               backgroundColor: 'white', 
               borderRadius: '16px',
               boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
               padding: '1rem',
             }}>
                {/* Dot */}
                <div style={{ 
                  position: 'absolute', 
                  left: '-1.45rem', 
                  top: '0px', 
                  width: '12px', height: '12px', 
                  borderRadius: '50%', backgroundColor: 'var(--danger-red)',
                  border: '2px solid var(--bg-color)',
                  zIndex: 2
                }}></div>

                {/* Avatars */}
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--danger-red)', backgroundColor: '#FDF2F2', zIndex: 1 }}></div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--danger-red)', backgroundColor: '#FDF2F2', marginLeft: '-8px', zIndex: 2 }}></div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--danger-red)', marginLeft: '-8px', zIndex: 3 }}></div>
                </div>
             </div>

          </div>
        </div>

      </main>

      <BottomNav activeTab="agenda" />
    </div>
  );
}
