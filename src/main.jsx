import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './vfc.css';

const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const vfcLogo = 'data:image/jpeg;base64,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';

const vehicleTypes = [
  {id:'auto', label:'Auto', icon:'🚗', duration:'Hasta 2 hs'},
  {id:'suv', label:'SUV', icon:'🚙', duration:'Duración a confirmar'},
  {id:'pickup', label:'Pickup / Camioneta', icon:'🛻', duration:'Hasta 2 hs 30 min'},
];

const defaultServices = [{
  id:'detailing',
  name:'Detailing completo',
  prices:{auto:28000,suv:30000,pickup:37000},
  deposit:0,
  minutes:120,
  desc:'Limpieza profunda interior y exterior con aspirado, tapicería, descontaminación, espuma activa, siliconas y perfumante.'
}];

const extras = [
  {id:'iron', name:'Desengrasante férreo + quita brea', desc:'Llantas y carrocería completa.', prices:{auto:5000,suv:5000,pickup:5000}},
  {id:'shine', name:'Abrillantado con protección', desc:'Terminación y protección de la carrocería.', prices:{auto:15000,suv:17000,pickup:20000}},
  {id:'glass', name:'Limpieza y descontaminación de vidrios', desc:'Tratamiento con productos especiales.', prices:{auto:8000,suv:8000,pickup:8000}},
];

const detailingIncludes = [
  'Aspirado completo',
  'Limpieza de tapicería',
  'Descontaminación interior y exterior, incluido baúl',
  'Limpieza profunda interior con brochas y materiales especiales',
  'Limpieza exterior con espuma activa',
  'Silicona exterior e interior en ruedas y paragolpes afectados por el sol',
  'Perfumante',
];

const initialBookings = [
  {id:1,date:'2026-08-12',time:'10:30',name:'Martín López',phone:'342 555 1100',vehicleType:'auto',vehicle:'VW Golf',plate:'AB123CD',serviceId:'detailing',service:'Detailing completo',price:28000,deposit:0,status:'Pendiente'},
  {id:2,date:'2026-08-13',time:'11:00',name:'Lucas Gómez',phone:'342 555 3300',vehicleType:'pickup',vehicle:'Ford Ranger',plate:'AF789HI',serviceId:'detailing',service:'Detailing completo',price:42000,deposit:0,status:'Confirmado'},
];

function App(){
  const [route,setRoute] = useState('home');
  const [adminTab,setAdminTab] = useState('summary');
  const [services,setServices] = useState(defaultServices);
  const [bookings,setBookings] = useState(initialBookings);
  const [slots,setSlots] = useState(['10:30','11:00','11:30','13:00','14:30','16:30']);
  const [openSlots,setOpenSlots] = useState(['10:30','11:00','11:30','13:00','14:30','16:30']);
  const [booking,setBooking] = useState({vehicleType:null,serviceId:'detailing',extras:[],date:'2026-08-12',time:'',name:'',phone:'',plate:'',vehicle:'',notes:''});
  const [notice,setNotice] = useState('');
  const [requestCode,setRequestCode] = useState('');

  const selected = services.find(s=>s.id===booking.serviceId);
  const basePrice = selected && booking.vehicleType ? selected.prices[booking.vehicleType] : 0;
  const extrasPrice = useMemo(()=>booking.vehicleType ? booking.extras.reduce((total,id)=>{
    const extra = extras.find(e=>e.id===id);
    return total + (extra?.prices[booking.vehicleType] || 0);
  },0) : 0,[booking.extras,booking.vehicleType]);
  const totalPrice = basePrice + extrasPrice;

  const navTo = r => {setRoute(r); setNotice(''); window.scrollTo({top:0,behavior:'smooth'});};

  const sendRequest=()=>{
    const parts = booking.date.split('-').map(Number);
    const weekday = parts.length===3 ? new Date(parts[0],parts[1]-1,parts[2]).getDay() : -1;
    if(!booking.vehicleType || !booking.date || !booking.time || !booking.name.trim() || !booking.phone.trim()){
      setNotice('Completá vehículo, día, horario preferido, nombre y teléfono para enviar la solicitud.'); return;
    }
    if(![3,4,5,6].includes(weekday)){
      setNotice('VFC Detailing trabaja de miércoles a sábado. Elegí uno de esos días.'); return;
    }
    const id = Date.now();
    setRequestCode(`VFC-${String(id).slice(-5)}`);
    setBookings(prev=>[...prev,{
      id,date:booking.date,time:booking.time,name:booking.name,phone:booking.phone,
      vehicleType:booking.vehicleType,vehicle:booking.vehicle||vehicleTypes.find(v=>v.id===booking.vehicleType)?.label,
      plate:booking.plate||'Sin patente',serviceId:selected.id,service:selected.name,
      price:totalPrice,deposit:0,status:'Pendiente',extras:[...booking.extras],notes:booking.notes
    }]);
    navTo('success');
  };

  if(route==='admin') return <Admin adminTab={adminTab} setAdminTab={setAdminTab} bookings={bookings} setBookings={setBookings} services={services} setServices={setServices} slots={slots} setSlots={setSlots} openSlots={openSlots} setOpenSlots={setOpenSlots} navTo={navTo}/>;

  return <div className="app-shell">
    <Topbar navTo={navTo}/>
    {route==='home' && <Home services={services} booking={booking} setBooking={setBooking} navTo={navTo}/>} 
    {route==='booking' && <Booking booking={booking} setBooking={setBooking} selected={selected} basePrice={basePrice} extrasPrice={extrasPrice} totalPrice={totalPrice} openSlots={openSlots} notice={notice} sendRequest={sendRequest} navTo={navTo}/>} 
    {route==='success' && <Success booking={booking} selected={selected} totalPrice={totalPrice} requestCode={requestCode} navTo={navTo}/>} 
    <Footer navTo={navTo}/>
    {route==='home' && <button className="mobile-sticky-cta" onClick={()=>navTo('booking')}>Solicitar turno</button>}
  </div>
}

function Brand({compact=false}){
  return <span className={`brand-lockup ${compact?'compact':''}`}><img src={vfcLogo} alt="Logo VFC Detailing"/><span><b>VFC</b><small>DETAILING</small></span></span>
}

function Topbar({navTo}){
  return <header className="topbar"><div className="container topbar-inner">
    <button className="mini-brand" onClick={()=>navTo('home')}><Brand compact/></button>
    <button className="top-cta" onClick={()=>navTo('booking')}>Solicitar turno</button>
  </div></header>
}

function BusinessCard(){
  return <section className="business-wrap"><div className="container">
    <div className="business-card">
      <div className="logo-photo logo-real"><img src={vfcLogo} alt="VFC Detailing"/></div>
      <div className="business-info">
        <div className="business-title-row"><div><span className="eyebrow">LAVADO • DETAILING</span><h1>VFC Detailing</h1></div><span className="rating">Santa Fe</span></div>
        <div className="business-meta">
          <span>📍 Entre Ríos 3556</span>
          <span>🕒 Mié 10:30–17:00 · Jue a Sáb 10:30–18:00</span>
          <span>✓ Turnos sujetos a confirmación</span>
        </div>
      </div>
    </div>
  </div></section>
}

function Home({services,booking,setBooking,navTo}){
  const selected = services[0];
  const price = booking.vehicleType ? selected.prices[booking.vehicleType] : 0;
  const vehicle = vehicleTypes.find(v=>v.id===booking.vehicleType);
  return <>
    <BusinessCard/>
    <main className="container home-main">
      <section className="booking-panel compact-panel">
        <div className="panel-heading"><div><span className="eyebrow">SOLICITUD DE TURNO</span><h2>Elegí tu vehículo</h2><p>El precio del detailing se actualiza automáticamente según el tipo de vehículo.</p></div><span className="step-pill">1 de 3</span></div>
        <VehicleSelector value={booking.vehicleType} onChange={(id)=>setBooking(b=>({...b,vehicleType:id}))}/>
        <div className={`service-card ${booking.vehicleType?'featured':''}`}>
          <div className="service-top"><div><h3>{selected.name}</h3><p>{selected.desc}</p></div><span className="duration">{vehicle?.duration || 'Elegí vehículo'}</span></div>
          <div className="service-bottom"><div><small>{booking.vehicleType?'Precio base':'Precio según vehículo'}</small><strong>{booking.vehicleType?money(price):'—'}</strong></div><button disabled={!booking.vehicleType} onClick={()=>navTo('booking')}>Continuar</button></div>
        </div>
        <div className="services-title"><h3>¿Qué incluye?</h3><span>Detailing completo</span></div>
        <div className="include-grid">{detailingIncludes.map(item=><div className="include-item" key={item}>✓ {item}</div>)}</div>
        <small className="muted">Pickups: el precio incluye limpieza completa de caja trasera. Vehículos con condiciones especiales: consultar.</small>
      </section>

      <section className="how-section">
        <div className="section-heading"><div><span className="eyebrow">SIMPLE Y FLEXIBLE</span><h2>¿Cómo funciona?</h2></div></div>
        <div className="how-grid">
          <article><span>1</span><div><b>Elegís</b><p>Vehículo, adicionales, día y horario preferido.</p></div></article>
          <article><span>2</span><div><b>Enviás la solicitud</b><p>VFC recibe todos los datos y revisa la agenda.</p></div></article>
          <article><span>3</span><div><b>VFC confirma</b><p>Te confirman ese horario o te proponen otra opción.</p></div></article>
        </div>
      </section>

      <section className="works-section">
        <div className="section-heading"><div><span className="eyebrow">TRABAJOS REALES</span><h2>Resultados de VFC</h2></div><p>Exterior e interior realizados por VFC Detailing.</p></div>
        <div className="gallery-grid gallery-real">
        <img src="/images/IMG_minic.jpg" alt="Mini Cooper exterior" />
        <img src="/images/IMG_minicINT.jpg" alt="Mini Cooper interior" />
        <img src="/images/IMG_chino.jpg" alt="Exterior VFC" />
        <img src="/images/IMG_chinoINT.jpg" alt="Interior VFC" />
        </div>
      </section>

      <section className="policy-card">
        <div><span className="eyebrow">ANTES DE SOLICITAR</span><h3>Turnos flexibles, confirmados por VFC</h3><p>Elegís un día y horario preferido. VFC revisa la agenda y confirma ese horario o te propone otra opción.</p></div>
        <div className="policy-points"><span>✓ Cancelación con 24 hs de anticipación</span><span>✓ Precios sujetos a revisión en vehículos con condiciones especiales</span></div>
      </section>
    </main>
  </>
}

function VehicleSelector({value,onChange}){
  return <div className="vehicle-grid">{vehicleTypes.map(v=><button key={v.id} className={`vehicle-btn ${value===v.id?'active':''}`} onClick={()=>onChange(v.id)}><span className="vehicle-icon">{v.icon}</span><span>{v.label}</span>{value===v.id && <b>✓</b>}</button>)}</div>
}

function Booking({booking,setBooking,selected,basePrice,extrasPrice,totalPrice,openSlots,notice,sendRequest,navTo}){
  const vehicle = vehicleTypes.find(v=>v.id===booking.vehicleType);
  const toggleExtra=id=>setBooking(b=>({...b,extras:b.extras.includes(id)?b.extras.filter(x=>x!==id):[...b.extras,id]}));
  const selectedExtras = extras.filter(e=>booking.extras.includes(e.id));
  const whatsappText = encodeURIComponent('Hola VFC Detailing, quería hacer una consulta por un vehículo con una condición especial.');

  if(!booking.vehicleType) return <main className="container booking-page"><button className="back-link" onClick={()=>navTo('home')}>← Volver</button><section className="booking-panel"><h2>Primero elegí tu vehículo</h2><p>Necesitamos el tipo de vehículo para calcular precio y duración estimada.</p><button className="pay-btn" onClick={()=>navTo('home')}>Elegir vehículo</button></section></main>;

  return <main className="container booking-page">
    <button className="back-link" onClick={()=>navTo('home')}>← Volver</button>
    <div className="booking-layout">
      <section className="booking-panel">
        <div className="panel-heading"><div><span className="eyebrow">SOLICITUD DE TURNO</span><h2>Armá tu detailing</h2><p>Elegí adicionales y después indicá el día y horario que preferís. VFC confirma el turno antes de que quede reservado.</p></div><span className="step-pill">2 de 3</span></div>

        <label className="field-label">Vehículo</label>
        <VehicleSelector value={booking.vehicleType} onChange={(id)=>setBooking(b=>({...b,vehicleType:id}))}/>
        <div className="price-strip"><div><small>Detailing base</small><b>{money(basePrice)}</b></div><div><small>Duración estimada</small><b>{vehicle.duration}</b></div></div>

        <label className="field-label">Servicios adicionales</label>
        <div className="extra-grid">{extras.map(extra=>{
          const active=booking.extras.includes(extra.id);
          return <button type="button" key={extra.id} className={`extra-card ${active?'selected':''}`} onClick={()=>toggleExtra(extra.id)}><span><b>{active?'✓ ':''}{extra.name}</b><small>{extra.desc}</small></span><strong>+{money(extra.prices[booking.vehicleType])}</strong></button>
        })}</div>

        <div className="form-grid">
          <label>Día preferido<input type="date" value={booking.date} onChange={e=>setBooking(b=>({...b,date:e.target.value,time:''}))}/><small className="muted">Miércoles a sábado</small></label>
          <label>Horario preferido<select value={booking.time} onChange={e=>setBooking(b=>({...b,time:e.target.value}))}><option value="">Elegir horario</option>{openSlots.map(s=><option key={s}>{s}</option>)}</select><small className="muted">Es una preferencia, queda sujeto a confirmación.</small></label>
          <label>Nombre y apellido<input placeholder="Ej. Francisco Pagliano" value={booking.name} onChange={e=>setBooking(b=>({...b,name:e.target.value}))}/></label>
          <label>Teléfono<input placeholder="342..." value={booking.phone} onChange={e=>setBooking(b=>({...b,phone:e.target.value}))}/></label>
          <label>Modelo del vehículo<input placeholder="Ej. Toyota Hilux" value={booking.vehicle} onChange={e=>setBooking(b=>({...b,vehicle:e.target.value}))}/></label>
          <label>Patente <span className="muted">(opcional)</span><input placeholder="AB123CD" value={booking.plate} onChange={e=>setBooking(b=>({...b,plate:e.target.value.toUpperCase()}))}/></label>
          <label className="full-field">Observaciones <span className="muted">(opcional)</span><textarea placeholder="Ej. mucho barro, pelos de mascota, manchas difíciles..." value={booking.notes} onChange={e=>setBooking(b=>({...b,notes:e.target.value}))}/><small className="muted">Si el vehículo tiene una condición especial, VFC puede revisar el precio antes de confirmar.</small></label>
        </div>

        <a className="whatsapp-btn" href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noreferrer">💬 Consultar condición especial por WhatsApp</a>
        <div className="notice">El horario elegido es una preferencia. La solicitud no bloquea automáticamente la agenda: VFC confirma o propone otra opción.</div>
        {notice && <div className="notice">{notice}</div>}
      </section>

      <aside className="summary-card">
        <span className="eyebrow">REVISÁ ANTES DE ENVIAR</span>
        <h3>{selected.name}</h3>
        <div className="summary-row"><span>Vehículo</span><b>{vehicle.label}</b></div>
        <div className="summary-row"><span>Detailing</span><b>{money(basePrice)}</b></div>
        {selectedExtras.map(extra=><div className="summary-row summary-extra" key={extra.id}><span>{extra.name}</span><b>+{money(extra.prices[booking.vehicleType])}</b></div>)}
        <div className="summary-row"><span>Adicionales</span><b>{extrasPrice?money(extrasPrice):'Sin adicionales'}</b></div>
        <div className="summary-row total-row"><span>Total estimado</span><b>{money(totalPrice)}</b></div>
        <div className="summary-row"><span>Duración</span><b>{vehicle.duration}</b></div>
        <div className="summary-row"><span>Día preferido</span><b>{booking.date || '—'}</b></div>
        <div className="summary-row"><span>Horario preferido</span><b>{booking.time || '—'}</b></div>
        <button className="pay-btn" onClick={sendRequest}>Enviar solicitud de turno</button>
        <small>VFC revisará la disponibilidad. Las cancelaciones deben hacerse con 24 hs de anticipación.</small>
      </aside>
    </div>
  </main>
}

function Success({booking,selected,totalPrice,requestCode,navTo}){
  const vehicle = vehicleTypes.find(v=>v.id===booking.vehicleType);
  const selectedExtras = extras.filter(e=>booking.extras.includes(e.id));
  return <main className="container success-wrap"><div className="success-card">
    <div className="check">✓</div><span className="eyebrow">SOLICITUD RECIBIDA</span><h1>¡Listo, {booking.name || 'recibimos tu solicitud'}!</h1>
    <span className="pending-badge">● Pendiente de confirmación</span>
    <p>VFC Detailing va a revisar la disponibilidad y te confirmará el horario o te propondrá otra opción.</p>
    <div className="request-code">{requestCode || 'VFC-PENDIENTE'}</div>
    <div className="success-details success-summary"><b>{selected?.name}</b><span>{vehicle?.label} · {vehicle?.duration}</span><span>{booking.date} · horario preferido {booking.time}</span>{selectedExtras.length>0 && <span>{selectedExtras.map(e=>e.name).join(' · ')}</span>}<strong>Total estimado {money(totalPrice)}</strong></div>
    <button className="pay-btn" onClick={()=>navTo('home')}>Volver al inicio</button>
  </div></main>
}

function Admin({adminTab,setAdminTab,bookings,setBookings,services,setServices,slots,setSlots,openSlots,setOpenSlots,navTo}){
  const delivered = bookings.filter(b=>b.status==='Entregado');
  const pending = bookings.filter(b=>b.status==='Pendiente');
  const revenue = delivered.reduce((a,b)=>a+b.price,0);
  const confirmed = bookings.filter(b=>b.status==='Confirmado').length;
  const updateStatus=(id,status)=>setBookings(bs=>bs.map(b=>b.id===id?{...b,status}:b));
  const toggleSlot=(slot)=>setOpenSlots(os=>os.includes(slot)?os.filter(s=>s!==slot):[...os,slot].sort());
  const addSlot=()=>{const v=prompt('Nuevo horario sugerido (ej. 17:00)'); if(v && /^\d{2}:\d{2}$/.test(v) && !slots.includes(v)){setSlots(s=>[...s,v].sort());setOpenSlots(s=>[...s,v].sort())}};
  const changePrice=(id,type,val)=>setServices(ss=>ss.map(s=>s.id===id?{...s,prices:{...s.prices,[type]:Number(val)||0}}:s));

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><img className="admin-logo" src={vfcLogo} alt="VFC"/><div><b>VFC Detailing</b><small>Administración</small></div></div>
      {[['summary','Resumen'],['bookings','Solicitudes'],['hours','Horarios'],['services','Precios']].map(([id,l])=><button key={id} className={adminTab===id?'active':''} onClick={()=>setAdminTab(id)}>{l}</button>)}
      <button className="admin-back" onClick={()=>navTo('home')}>← Ver sitio</button>
    </aside>
    <main className="admin-main">
      <div className="admin-header"><div><span className="eyebrow">PANEL DE CONTROL</span><h1>{adminTab==='summary'?'Resumen':adminTab==='bookings'?'Solicitudes':adminTab==='hours'?'Horarios sugeridos':'Precios del detailing'}</h1></div><span className="admin-date">AGO 2026</span></div>
      {adminTab==='summary' && <><div className="stats-grid"><Stat label="Solicitudes pendientes" value={pending.length} sub="Esperando revisión"/><Stat label="Turnos confirmados" value={confirmed} sub="Agenda aprobada"/><Stat label="Facturación realizada" value={money(revenue)} sub="Trabajos entregados"/><Stat label="Horarios sugeridos" value={openSlots.length} sub="Opciones visibles al cliente"/></div><div className="admin-card"><div className="card-title"><h2>Solicitudes pendientes</h2><button onClick={()=>setAdminTab('bookings')}>Ver todas</button></div><BookingsTable bookings={pending} updateStatus={updateStatus}/></div></>}
      {adminTab==='bookings' && <div className="admin-card"><div className="card-title"><div><h2>Solicitudes y turnos</h2><p>Revisá el horario preferido del cliente y confirmá o rechazá la solicitud.</p></div></div><BookingsTable bookings={bookings} updateStatus={updateStatus}/></div>}
      {adminTab==='hours' && <div className="admin-card"><div className="card-title"><div><h2>Horarios sugeridos</h2><p>Estos horarios aparecen como preferencias para los clientes. No quedan reservados hasta que confirmes.</p></div><button className="admin-action" onClick={addSlot}>+ Agregar horario</button></div><div className="slots-admin">{slots.map(s=><button key={s} className={openSlots.includes(s)?'on':'off'} onClick={()=>toggleSlot(s)}><b>{s}</b><span>{openSlots.includes(s)?'Visible':'Oculto'}</span></button>)}</div></div>}
      {adminTab==='services' && <div className="admin-card"><div className="card-title"><div><h2>Precio base del detailing</h2><p>Modificá el precio según el tipo de vehículo.</p></div></div><div className="service-admin-list">{services.map(s=><div className="service-admin-row" key={s.id}><div><b>{s.name}</b><small>Precio base</small></div><div className="price-edit-grid">{vehicleTypes.map(v=><label key={v.id}><span>{v.label}</span><input type="number" value={s.prices[v.id]} onChange={e=>changePrice(s.id,v.id,e.target.value)}/></label>)}</div></div>)}</div></div>}
    </main>
  </div>
}

function Stat({label,value,sub}){return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>}

function BookingsTable({bookings,updateStatus}){
  return <div className="table-wrap"><table><thead><tr><th>Preferencia</th><th>Cliente</th><th>Vehículo</th><th>Servicio</th><th>Total</th><th>Estado</th></tr></thead><tbody>{bookings.map(b=><tr key={b.id}><td><b>{b.date}</b><small>{b.time}</small></td><td>{b.name}<small>{b.phone}</small></td><td>{b.vehicle}<small>{b.plate}</small></td><td>{b.service}</td><td>{money(b.price)}</td><td><select className={`status status-${b.status.replaceAll(' ','-').toLowerCase()}`} value={b.status} onChange={e=>updateStatus(b.id,e.target.value)}>{['Pendiente','Confirmado','En lavado','Terminado','Entregado','Cancelado','Rechazado'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>
}

function Footer({navTo}){
  return <footer className="site-footer"><div className="container footer-inner footer-vfc">
    <div className="footer-brand"><Brand/><span>Entre Ríos 3556 · Santa Fe</span></div>
    <div className="footer-info"><span>Mié 10:30–17:00 · Jue a Sáb 10:30–18:00</span><span>Instagram: @vfc_detailing</span><span>Cancelaciones con 24 hs de anticipación</span></div>
    <button onClick={()=>navTo('admin')}>Acceso administrador</button>
  </div></footer>
}

createRoot(document.getElementById('root')).render(<App/>);