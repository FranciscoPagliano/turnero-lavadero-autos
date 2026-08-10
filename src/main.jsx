import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './vfc.css';

const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);

const vehicleTypes = [
  {id:'auto', label:'Auto', icon:'🚗', duration:'Hasta 2 hs'},
  {id:'suv', label:'SUV', icon:'🚙', duration:'Duración a confirmar'},
  {id:'pickup', label:'Pickup / Camioneta', icon:'🛻', duration:'Hasta 2 hs 30 min'},
];

const defaultServices = [
  {
    id:'detailing',
    name:'Detailing completo',
    prices:{auto:28000,suv:30000,pickup:37000},
    deposit:0,
    minutes:120,
    desc:'Limpieza profunda interior y exterior con aspirado, tapicería, descontaminación, espuma activa, siliconas y perfumante.'
  },
];

const extras = [
  {id:'iron', name:'Desengrasante férreo + quita brea', desc:'Llantas y carrocería completa.', prices:{auto:5000,suv:5000,pickup:5000}},
  {id:'shine', name:'Abrillantado con protección', desc:'Terminación y protección de la carrocería.', prices:{auto:15000,suv:17000,pickup:20000}},
  {id:'glass', name:'Limpieza y descontaminación de vidrios', desc:'Tratamiento con productos especiales.', prices:{auto:8000,suv:8000,pickup:8000}},
];

const detailingIncludes = [
  'Aspirado completo',
  'Limpieza de tapicería',
  'Descontaminación interior y exterior, incluido baúl',
  'Limpieza profunda de carrocería interior con brochas y materiales especiales',
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
      id, date:booking.date, time:booking.time, name:booking.name, phone:booking.phone,
      vehicleType:booking.vehicleType, vehicle:booking.vehicle||vehicleTypes.find(v=>v.id===booking.vehicleType)?.label,
      plate:booking.plate||'Sin patente', serviceId:selected.id, service:selected.name,
      price:totalPrice, deposit:0, status:'Pendiente', extras:[...booking.extras], notes:booking.notes
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
  </div>
}

function Topbar({navTo}){
  return <header className="topbar"><div className="container topbar-inner">
    <button className="mini-brand" onClick={()=>navTo('home')}><span className="mini-logo">VFC</span><b>VFC Detailing</b></button>
    <button className="top-cta" onClick={()=>navTo('booking')}>Solicitar turno</button>
  </div></header>
}

function BusinessCard(){
  return <section className="business-wrap"><div className="container">
    <div className="business-card">
      <div className="logo-photo">VFC</div>
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

      <section className="works-section">
        <div className="section-heading"><div><span className="eyebrow">TRABAJOS REALES</span><h2>Resultados de VFC</h2></div><p>Exterior e interior realizados por VFC Detailing.</p></div>
        <div className="gallery-grid gallery-real">
          <div className="work-card real-1"><span>Terminación exterior</span></div>
          <div className="work-card real-2"><span>Detalle interior</span></div>
          <div className="work-card real-1"><span>Brillo y terminación</span></div>
          <div className="work-card real-2"><span>Interior protegido</span></div>
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

        <div className="notice">La solicitud no bloquea automáticamente el horario. VFC Detailing revisa la agenda y confirma o propone otra opción.</div>
        {notice && <div className="notice">{notice}</div>}
      </section>

      <aside className="summary-card">
        <span className="eyebrow">TU SOLICITUD</span>
        <h3>{selected.name}</h3>
        <div className="summary-row"><span>Vehículo</span><b>{vehicle.label}</b></div>
        <div className="summary-row"><span>Detailing</span><b>{money(basePrice)}</b></div>
        <div className="summary-row"><span>Adicionales</span><b>{extrasPrice?money(extrasPrice):'Sin adicionales'}</b></div>
        <div className="summary-row"><span>Total estimado</span><b>{money(totalPrice)}</b></div>
        <div className="summary-row"><span>Duración</span><b>{vehicle.duration}</b></div>
        <button className="pay-btn" onClick={sendRequest}>Enviar solicitud de turno</button>
        <small>VFC revisará la disponibilidad. Las cancelaciones deben hacerse con 24 hs de anticipación.</small>
      </aside>
    </div>
  </main>
}

function Success({booking,selected,totalPrice,requestCode,navTo}){
  const vehicle = vehicleTypes.find(v=>v.id===booking.vehicleType);
  return <main className="container success-wrap"><div className="success-card"><div className="check">✓</div><span className="eyebrow">SOLICITUD RECIBIDA</span><h1>¡Listo, {booking.name || 'recibimos tu solicitud'}!</h1><p>VFC Detailing va a revisar la disponibilidad y te confirmará el horario o te propondrá otra opción.</p><div className="request-code">{requestCode || 'VFC-PENDIENTE'}</div><div className="success-details"><b>{selected?.name}</b><span>{booking.date} · horario preferido {booking.time}</span><span>{vehicle?.label} · total estimado {money(totalPrice)}</span></div><button className="pay-btn" onClick={()=>navTo('home')}>Volver al inicio</button></div></main>
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
      <div className="admin-brand"><span className="mini-logo">VFC</span><div><b>VFC Detailing</b><small>Administración</small></div></div>
      {[['summary','Resumen'],['bookings','Solicitudes'],['hours','Horarios'],['services','Precios']].map(([id,l])=><button key={id} className={adminTab===id?'active':''} onClick={()=>setAdminTab(id)}>{l}</button>)}
      <button className="admin-back" onClick={()=>navTo('home')}>← Ver sitio</button>
    </aside>
    <main className="admin-main">
      <div className="admin-header"><div><span className="eyebrow">PANEL DE CONTROL</span><h1>{adminTab==='summary'?'Resumen':adminTab==='bookings'?'Solicitudes':adminTab==='hours'?'Horarios sugeridos':'Precios del detailing'}</h1></div><span className="admin-date">AGO 2026</span></div>

      {adminTab==='summary' && <>
        <div className="stats-grid">
          <Stat label="Solicitudes pendientes" value={pending.length} sub="Esperando revisión"/>
          <Stat label="Turnos confirmados" value={confirmed} sub="Agenda aprobada"/>
          <Stat label="Facturación realizada" value={money(revenue)} sub="Trabajos entregados"/>
          <Stat label="Horarios sugeridos" value={openSlots.length} sub="Opciones visibles al cliente"/>
        </div>
        <div className="admin-card"><div className="card-title"><h2>Solicitudes pendientes</h2><button onClick={()=>setAdminTab('bookings')}>Ver todas</button></div><BookingsTable bookings={pending} updateStatus={updateStatus}/></div>
      </>}

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
  return <footer><div className="container footer-inner"><div><b>VFC Detailing</b><span>Entre Ríos 3556 · Miércoles a sábado</span></div><button onClick={()=>navTo('admin')}>Acceso administrador</button></div></footer>
}

createRoot(document.getElementById('root')).render(<App/>);