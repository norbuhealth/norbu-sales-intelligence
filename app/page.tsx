'use client';
import {useEffect,useMemo,useState} from 'react';
import Papa from 'papaparse';
import {Upload,Flame,MousePointerClick,Users,TrendingUp,Search,Download} from 'lucide-react';
import {Lead,classifyService,calculateScore,temperature} from '@/lib/scoring';

const seed:Lead[]=[];
export default function Home(){
 const [leads,setLeads]=useState<Lead[]>(seed); const [query,setQuery]=useState(''); const [filter,setFilter]=useState('All');
 useEffect(()=>{const x=localStorage.getItem('norbu-leads');if(x)setLeads(JSON.parse(x));},[]);
 useEffect(()=>{localStorage.setItem('norbu-leads',JSON.stringify(leads));},[leads]);
 function importFiles(files:FileList|null){if(!files)return;Array.from(files).forEach(file=>Papa.parse<Record<string,string>>(file,{header:true,skipEmptyLines:true,complete:r=>{const incoming=r.data.map((d,i)=>{const opens=Number(d.opens||0),clicks=Number(d.clicks||0),score=calculateScore(opens,clicks,d.url,d.referral_type);return {id:`${d.email}-${d.url}-${Date.now()}-${i}`,email:d.email||'',first_name:d.first_name||'',last_name:d.last_name||'',url:d.url||'',opens,clicks,law_firm_name:d.law_firm_name||'Unknown Account',referral_type:d.referral_type||'',account_representative:d.account_representative||'Unassigned',service:classifyService(d.url),score,temperature:temperature(score),referralReceived:false} as Lead});setLeads(prev=>dedupe([...prev,...incoming]));}}))}
 function dedupe(items:Lead[]){const map=new Map<string,Lead>();items.forEach(x=>{const k=`${x.email}|${x.url}`;const old=map.get(k);if(!old||x.clicks>old.clicks)map.set(k,x)});return [...map.values()]}
 const filtered=useMemo(()=>leads.filter(x=>(filter==='All'||x.temperature===filter)&&`${x.law_firm_name} ${x.email} ${x.service} ${x.account_representative}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>b.score-a.score),[leads,query,filter]);
 const hot=leads.filter(x=>x.temperature==='Hot'&&!x.referralReceived).length; const firms=new Set(leads.map(x=>x.law_firm_name)).size; const clicks=leads.reduce((s,x)=>s+x.clicks,0); const converted=leads.filter(x=>x.referralReceived).length;
 function update(id:string,patch:Partial<Lead>){setLeads(v=>v.map(x=>x.id===id?{...x,...patch}:x))}
 function exportCsv(){const csv=Papa.unparse(leads);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='norbu-sales-intelligence.csv';a.click()}
 return <main>
  <header><div><p className="eyebrow">NORBU HEALTH</p><h1>Sales Intelligence</h1><p>Turn email engagement into timely referral follow-up.</p></div><label className="upload"><Upload size={18}/> Import Mailchimp CSV<input type="file" accept=".csv" multiple hidden onChange={e=>importFiles(e.target.files)}/></label></header>
  <section className="metrics"><Metric icon={<Flame/>} label="Hot prospects" value={hot}/><Metric icon={<MousePointerClick/>} label="Total clicks" value={clicks}/><Metric icon={<Users/>} label="Accounts" value={firms}/><Metric icon={<TrendingUp/>} label="Confirmed referrals" value={converted}/></section>
  <section className="panel"><div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Search firm, contact, service or rep" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="filters">{['All','Hot','Warm','Monitor'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><button className="secondary" onClick={exportCsv}><Download size={16}/> Export</button></div>
  {leads.length===0?<div className="empty"><Upload size={38}/><h2>Import your Mailchimp click reports</h2><p>Select all exported CSV files at once. Duplicate contact-and-link records are combined automatically.</p></div>:
  <div className="tablewrap"><table><thead><tr><th>Priority</th><th>Account & contact</th><th>Interest</th><th>Engagement</th><th>Sales rep</th><th>Referral check</th><th>Notes</th></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td><span className={`pill ${x.temperature.toLowerCase()}`}>{x.score} · {x.temperature}</span></td><td><strong>{x.law_firm_name}</strong><small>{x.first_name} {x.last_name} · {x.email}</small></td><td><strong>{x.service}</strong><a href={x.url} target="_blank">View clicked page</a></td><td><strong>{x.clicks} clicks</strong><small>{x.opens} opens</small></td><td><input className="cellinput" value={x.account_representative} onChange={e=>update(x.id,{account_representative:e.target.value})}/></td><td><label className="check"><input type="checkbox" checked={x.referralReceived} onChange={e=>update(x.id,{referralReceived:e.target.checked})}/> {x.referralReceived?'Confirmed':'Check in 3 days'}</label>{x.referralReceived&&<input type="date" className="date" value={x.referralDate||''} onChange={e=>update(x.id,{referralDate:e.target.value})}/>}</td><td><textarea placeholder="Follow-up, outcome, context..." value={x.notes||''} onChange={e=>update(x.id,{notes:e.target.value})}/></td></tr>)}</tbody></table></div>}
  </section>
 </main>
}
function Metric({icon,label,value}:{icon:React.ReactNode,label:string,value:number}){return <div className="metric"><span>{icon}</span><div><b>{value}</b><p>{label}</p></div></div>}
