import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const vehicleTypes = [
  {id:'auto', label:'Auto', icon:'🚗'},
  {id:'suv', label:'SUV', icon:'🚙'},
  {id:'pickup', label:'Pickup / Camioneta', icon:'🛻'},
];

const defaultServices = [
  {id:'classic', name:'Lavado Clásico', prices:{auto:12000,suv:14000,pickup:16000}, deposit:4000, minutes:45, desc:'Exterior, aspirado interior, cristales y terminación de ruedas.'},
  {id:'wax', name:'Lavado + Cera', prices:{auto:16000,suv:18500,pickup:21000}, deposit:5000, minutes:60, desc:'Lavado clásico + cera protectora y acabado brillante.', badge:'Más elegido'},
  {id:'shine', name:'Lavado + Abrillantado', prices:{auto:19000,suv:22000,pickup:25000}, deposit:6000, minutes:75, desc:'Lavado completo + abrillantado para recuperar profundidad y brillo.'},
  {id:'premium', name:'Lavado Premium', prices:{auto:24000,suv:28000,pickup:32000}, deposit:7000, minutes:90, desc:'Cera, abrillantado, tratamiento de ruedas y terminación premium.'},
];

const initialBookings = [
  {id:1,date:'2026-08-09',time:'09:00',name:'Martín López',phone:'342 555 1100',vehicleType:'auto',vehicle:'VW Golf',plate:'AB123CD',serviceId:'classic',service:'Lavado Clásico',price:12000,deposit:4000,status:'Entregado'},
  {id:2,date:'2026-08-09',time:'10:00',name:'Sofía Pérez',phone:'342 555 2200',vehicleType:'auto',vehicle:'Toyota Corolla',plate:'AE456FG',serviceId:'wax',service:'Lavado + Cera',price:16000,deposit:5000,status:'Entregado'},
  {id:3,date:'2026-08-09',time:'11:30',name:'Lucas Gómez',phone:'342 555 3300',vehicleType:'pickup',vehicle:'Ford Ranger',plate:'AF789HI',serviceId:'premium',service:'Lavado Premium',price:32000,deposit:7000,status:'En lavado'},
  {id:4,date:'2026-08-09',time:'15:00',name:'Nicolás Ruiz',phone:'342 555 4400',vehicleType:'auto',vehicle:'Chevrolet Cruze',plate:'AC321JK',serviceId:'shine',service:'Lavado + Abrillantado',price:19000,deposit:6000,status:'Confirmado'},
];

const reviews = [
  {name:'Sofía R.', text:'Reservé en dos minutos y el auto quedó impecable.', stars:'★★★★★'},
  {name:'Lucas M.', text:'Muy buena atención y excelente terminación.', stars:'★★★★★'},
  {name:'Martín P.', text:'La cera quedó espectacular. Volvería sin dudas.', stars:'★★★★★'},
];

function App(){
  const [route,setRoute] = useState('home');
  const [adminTab,setAdminTab] = useState('summary');
  const [services,setServices] = useState(defaultServices);
  const [bookings,setBookings] = useState(initialBookings);
  const [slots,setSlots] = useState(['08:30','09:00','10:00','11:30','13:30','15:00','16:00','17:00','18:00']);
  const [openSlots,setOpenSlots] = useState(['08:30','09:00','10:00','11:30','13:30','15:00','16:00','17:00','18:00']);
  const [booking,setBooking] = useState({vehicleType:null,serviceId:null,date:'2026-08-11',time:'',name:'',phone:'',plate:'',vehicle:''});
  const [notice,setNotice] = useState('');
  const selected = services.find(s=>s.id===booking.serviceId);
  const selectedPrice = selected && booking.vehicleType ? selected.prices[booking.vehicleType] : 0;

  const navTo = r => {setRoute(r); setNotice(''); window.scrollTo({top:0,behavior:'smooth'});};

  const confirmBooking=()=>{
    if(!selected || !booking.vehicleType || !booking.time || !booking.name.trim() || !booking.phone.trim()){
      setNotice('Completá servicio, tipo de vehículo, horario, nombre y teléfono para continuar.'); return;
    }
    setBookings(prev=>[...prev,{
      id:Date.now(), date:booking.date, time:booking.time, name:booking.name, phone:booking.phone,
      vehicleType:booking.vehicleType, vehicle:booking.vehicle||vehicleTypes.find(v=>v.id===booking.vehicleType)?.label,
      plate:booking.plate||'Sin patente', serviceId:selected.id, service:selected.name,
      price:selectedPrice, deposit:selected.deposit, status:'Confirmado'
    }]);
    navTo('success');
  };

  if(route==='admin') return <Admin adminTab={adminTab} setAdminTab={setAdminTab} bookings={bookings} setBookings={setBookings} services={services} setServices={setServices} slots={slots} setSlots={setSlots} openSlots={openSlots} setOpenSlots={setOpenSlots} navTo={navTo}/>;

  return <div className="app-shell">
    <Topbar navTo={navTo}/>
    {route==='home' && <Home services={services} booking={booking} setBooking={setBooking} navTo={navTo}/>} 
    {route==='booking' && <Booking services={services} booking={booking} setBooking={setBooking} selected={selected} selectedPrice={selectedPrice} openSlots={openSlots} notice={notice} confirmBooking={confirmBooking} navTo={navTo}/>} 
    {route==='success' && <Success booking={booking} selected={selected} selectedPrice={selectedPrice} navTo={navTo}/>} 
    <Footer navTo={navTo}/>
  </div>
}

function Topbar({navTo}){
  return <header className="topbar"><div className="container topbar-inner">
    <button className="mini-brand" onClick={()=>navTo('home')}><span className="mini-logo">SG</span><b>Shine Garage</b></button>
    <button className="top-cta" onClick={()=>navTo('booking')}>Reservar turno</button>
  </div></header>
}

function BusinessCard(){
  return <section className="business-wrap"><div className="container">
    <div className="business-card">
      <div className="logo-photo">SG</div>
      <div className="business-info">
        <div className="business-title-row"><div><span className="eyebrow">LAVADERO • DETAILING</span><h1>Shine Garage</h1></div><span className="rating">★ 4.9</span></div>
        <div className="business-meta">
          <span>📍 Santa Fe, Argentina</span>
          <span>🕒 Lun a Sáb · 08:30 a 18:00</span>
          <span>✓ Reserva online con seña</span>
        </div>
      </div>
    </div>
  </div></section>
}

function Home({services,booking,setBooking,navTo}){
  const choose=(id)=>{setBooking(b=>({...b,serviceId:id,vehicleType:null}));navTo('booking')};
  return <>
    <BusinessCard/>
    <main className="container home-main">
      <section className="booking-panel compact-panel">
        <div className="panel-heading"><div><span className="eyebrow">RESERVA ONLINE</span><h2>Elegí tu lavado</h2><p>Seleccioná el servicio que querés. En el siguiente paso elegís tu vehículo y ves el precio exacto.</p></div><span className="step-pill">1 de 4</span></div>
        <div className="service-grid">
          {services.map(s=><ServiceCard key={s.id} service={s} onChoose={()=>choose(s.id)}/>) }
        </div>
      </section>

      <section className="works-section">
        <div className="section-heading"><div><span className="eyebrow">RESULTADOS REALES</span><h2>Trabajos realizados</h2></div><p>Después reemplazamos estas imágenes por fotos reales del lavadero.</p></div>
        <div className="gallery-grid">
          <div className="work-card work-1"><span>Exterior brillante</span></div>
          <div className="work-card work-2"><span>Detalle de ruedas</span></div>
          <div className="work-card work-3"><span>Terminación premium</span></div>
          <div className="work-card work-4"><span>Interior impecable</span></div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading"><div><span className="eyebrow">OPINIONES</span><h2>Lo que dicen nuestros clientes</h2></div><div className="big-rating">4.9 <span>★★★★★</span></div></div>
        <div className="reviews-grid">{reviews.map(r=><article className="review-card" key={r.name}><div className="stars">{r.stars}</div><p>“{r.text}”</p><b>{r.name}</b></article>)}</div>
      </section>
    </main>
  </>
}

function VehicleSelector({value,onChange}){
  return <div className="vehicle-grid">{vehicleTypes.map(v=><button key={v.id} className={`vehicle-btn ${value===v.id?'active':''}`} onClick={()=>onChange(v.id)}><span className="vehicle-icon">{v.icon}</span><span>{v.label}</span>{value===v.id && <b>✓</b>}</button>)}</div>
}

function ServiceCard({service,onChoose}){
  const lowestPrice = Math.min(...Object.values(service.prices));
  return <article className={`service-card ${service.badge?'featured':''}`}>
    {service.badge && <span className="badge">{service.badge}</span>}
    <div className="service-top"><div><h3>{service.name}</h3><p>{service.desc}</p></div><span className="duration">{service.minutes} min</span></div>
    <div className="service-bottom"><div><small>Desde</small><strong>{money(lowestPrice)}</strong></div><button onClick={onChoose}>Elegir</button></div>
  </article>
}

function Booking({services,booking,setBooking,selected,selectedPrice,openSlots,notice,confirmBooking,navTo}){
  const occupied = new Set(['10:00','15:00']);
  const available = openSlots.filter(s=>!occupied.has(s));
  return <main className="container booking-page">
    <button className="back-link" onClick={()=>navTo('home')}>← Volver</button>
    <div className="booking-layout">
      <section className="booking-panel">
        <div className="panel-heading"><div><span className="eyebrow">RESERVA ONLINE</span><h2>Completá tu turno</h2><p>{selected ? `Elegiste ${selected.name}. Seleccioná tu vehículo y los precios se actualizan automáticamente.` : 'Seleccioná tu vehículo para ver los precios correspondientes.'}</p></div><span className="step-pill">2–4 de 4</span></div>

        <label className="field-label">¿Qué vehículo vas a traer?</label>
        <VehicleSelector value={booking.vehicleType} onChange={(id)=>setBooking(b=>({...b,vehicleType:id}))}/>

        <label className="field-label">Servicio</label>
        <div className="service-select-list">{services.map(s=><button key={s.id} className={booking.serviceId===s.id?'selected':''} onClick={()=>setBooking(b=>({...b,serviceId:s.id}))}><span><b>{s.name}</b><small>{s.minutes} min</small></span><strong>{booking.vehicleType ? money(s.prices[booking.vehicleType]) : 'Elegí vehículo'}</strong></button>)}</div>

        {selected && booking.vehicleType && <div className="notice">{selected.name} para {vehicleTypes.find(v=>v.id===booking.vehicleType)?.label}: <b>{money(selectedPrice)}</b></div>}

        <div className="form-grid">
          <label>Fecha<input type="date" value={booking.date} onChange={e=>setBooking(b=>({...b,date:e.target.value,time:''}))}/></label>
          <label>Horario<select value={booking.time} onChange={e=>setBooking(b=>({...b,time:e.target.value}))}><option value="">Elegir horario</option>{available.map(s=><option key={s}>{s}</option>)}</select></label>
          <label>Nombre y apellido<input placeholder="Ej. Francisco Pagliano" value={booking.name} onChange={e=>setBooking(b=>({...b,name:e.target.value}))}/></label>
          <label>Teléfono<input placeholder="342..." value={booking.phone} onChange={e=>setBooking(b=>({...b,phone:e.target.value}))}/></label>
          <label>Modelo del vehículo<input placeholder="Ej. Toyota Hilux" value={booking.vehicle} onChange={e=>setBooking(b=>({...b,vehicle:e.target.value}))}/></label>
          <label>Patente <span className="muted">(opcional)</span><input placeholder="AB123CD" value={booking.plate} onChange={e=>setBooking(b=>({...b,plate:e.target.value.toUpperCase()}))}/></label>
        </div>
        {notice && <div className="notice">{notice}</div>}
      </section>

      <aside className="summary-card">
        <span className="eyebrow">TU RESERVA</span>
        <h3>{selected?.name || 'Elegí un lavado'}</h3>
        <div className="summary-row"><span>Vehículo</span><b>{booking.vehicleType ? vehicleTypes.find(v=>v.id===booking.vehicleType)?.label : '—'}</b></div>
        <div className="summary-row"><span>Precio</span><b>{selected && booking.vehicleType?money(selectedPrice):'—'}</b></div>
        <div className="summary-row"><span>Seña</span><b>{selected && booking.vehicleType?money(selected.deposit):'—'}</b></div>
        <div className="summary-row"><span>Saldo en el local</span><b>{selected && booking.vehicleType?money(selectedPrice-selected.deposit):'—'}</b></div>
        <button className="pay-btn" onClick={confirmBooking}>Continuar al pago de seña</button>
        <small>Maqueta: el pago está simulado. Luego puede conectarse con Mercado Pago.</small>
      </aside>
    </div>
  </main>
}

function Success({booking,selected,selectedPrice,navTo}){
  return <main className="container success-wrap"><div className="success-card"><div className="check">✓</div><span className="eyebrow">RESERVA CONFIRMADA</span><h1>¡Listo, {booking.name || 'tu turno'}!</h1><p>Tu turno quedó reservado correctamente.</p><div className="success-details"><b>{selected?.name}</b><span>{booking.date} · {booking.time}</span><span>{vehicleTypes.find(v=>v.id===booking.vehicleType)?.label} · {money(selectedPrice)}</span></div><button className="pay-btn" onClick={()=>navTo('home')}>Volver al inicio</button></div></main>
}

function Admin({adminTab,setAdminTab,bookings,setBookings,services,setServices,slots,setSlots,openSlots,setOpenSlots,navTo}){
  const delivered = bookings.filter(b=>b.status==='Entregado');
  const revenue = delivered.reduce((a,b)=>a+b.price,0);
  const deposits = bookings.reduce((a,b)=>a+b.deposit,0);
  const today = bookings.filter(b=>b.date==='2026-08-09');

  const updateStatus=(id,status)=>setBookings(bs=>bs.map(b=>b.id===id?{...b,status}:b));
  const toggleSlot=(slot)=>setOpenSlots(os=>os.includes(slot)?os.filter(s=>s!==slot):[...os,slot].sort());
  const addSlot=()=>{const v=prompt('Nuevo horario (ej. 19:00)'); if(v && /^\d{2}:\d{2}$/.test(v) && !slots.includes(v)){setSlots(s=>[...s,v].sort());setOpenSlots(s=>[...s,v].sort())}};
  const changePrice=(id,type,val)=>setServices(ss=>ss.map(s=>s.id===id?{...s,prices:{...s.prices,[type]:Number(val)||0}}:s));

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span className="mini-logo">SG</span><div><b>Shine Garage</b><small>Administración</small></div></div>
      {[['summary','Resumen'],['bookings','Turnos'],['hours','Horarios'],['services','Servicios']].map(([id,l])=><button key={id} className={adminTab===id?'active':''} onClick={()=>setAdminTab(id)}>{l}</button>)}
      <button className="admin-back" onClick={()=>navTo('home')}>← Ver sitio</button>
    </aside>
    <main className="admin-main">
      <div className="admin-header"><div><span className="eyebrow">PANEL DE CONTROL</span><h1>{adminTab==='summary'?'Resumen':adminTab==='bookings'?'Turnos':adminTab==='hours'?'Horarios':'Servicios y precios'}</h1></div><span className="admin-date">9 AGO 2026</span></div>

      {adminTab==='summary' && <>
        <div className="stats-grid">
          <Stat label="Facturación realizada" value={money(revenue)} sub="Lavados entregados"/>
          <Stat label="Lavados realizados" value={delivered.length} sub={`${today.length} turnos hoy`}/>
          <Stat label="Señas cobradas" value={money(deposits)} sub="Reservas confirmadas"/>
          <Stat label="Horarios activos" value={`${openSlots.length}/${slots.length}`} sub="Disponibles para reservar"/>
        </div>
        <div className="admin-card"><div className="card-title"><h2>Turnos de hoy</h2><button onClick={()=>setAdminTab('bookings')}>Ver todos</button></div><BookingsTable bookings={today} updateStatus={updateStatus}/></div>
      </>}

      {adminTab==='bookings' && <div className="admin-card"><div className="card-title"><div><h2>Todos los turnos</h2><p>Gestioná el estado de cada vehículo.</p></div></div><BookingsTable bookings={bookings} updateStatus={updateStatus}/></div>}

      {adminTab==='hours' && <div className="admin-card"><div className="card-title"><div><h2>Horarios disponibles</h2><p>Apagá un horario y dejará de aparecer para los clientes.</p></div><button className="admin-action" onClick={addSlot}>+ Agregar horario</button></div><div className="slots-admin">{slots.map(s=><button key={s} className={openSlots.includes(s)?'on':'off'} onClick={()=>toggleSlot(s)}><b>{s}</b><span>{openSlots.includes(s)?'Disponible':'Cerrado'}</span></button>)}</div></div>}

      {adminTab==='services' && <div className="admin-card"><div className="card-title"><div><h2>Servicios y precios</h2><p>Cada servicio puede tener un precio distinto según el vehículo.</p></div></div><div className="service-admin-list">{services.map(s=><div className="service-admin-row" key={s.id}><div><b>{s.name}</b><small>{s.minutes} min · Seña {money(s.deposit)}</small></div><div className="price-edit-grid">{vehicleTypes.map(v=><label key={v.id}><span>{v.label}</span><input type="number" value={s.prices[v.id]} onChange={e=>changePrice(s.id,v.id,e.target.value)}/></label>)}</div></div>)}</div></div>}
    </main>
  </div>
}

function Stat({label,value,sub}){return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>}

function BookingsTable({bookings,updateStatus}){
  return <div className="table-wrap"><table><thead><tr><th>Hora</th><th>Cliente</th><th>Vehículo</th><th>Servicio</th><th>Total</th><th>Estado</th></tr></thead><tbody>{bookings.map(b=><tr key={b.id}><td><b>{b.time}</b></td><td>{b.name}<small>{b.phone}</small></td><td>{b.vehicle}<small>{b.plate}</small></td><td>{b.service}</td><td>{money(b.price)}</td><td><select className={`status status-${b.status.replaceAll(' ','-').toLowerCase()}`} value={b.status} onChange={e=>updateStatus(b.id,e.target.value)}>{['Confirmado','En lavado','Terminado','Entregado','Cancelado'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>
}

function Footer({navTo}){
  return <footer><div className="container footer-inner"><div><b>Shine Garage</b><span>Santa Fe, Argentina · Lun a Sáb 08:30–18:00</span></div><button onClick={()=>navTo('admin')}>Acceso administrador</button></div></footer>
}

createRoot(document.getElementById('root')).render(<App/>);