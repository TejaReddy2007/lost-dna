import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, MapPin, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/plus-jakarta-sans';
import './styles.css';

type ReportKind = 'lost' | 'found';

function Mark() {
  return <span className="mark" aria-hidden="true"><span>LD</span></span>;
}

function ReportPanel({ kind, close }: { kind: ReportKind; close: () => void }) {
  const [sent, setSent] = useState(false);
  const title = kind === 'lost' ? 'Tell us what went missing' : 'Tell us what you found';

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="panel" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <button className="icon-button close" onClick={close} aria-label="Close"><X /></button>
        {sent ? (
          <div className="success">
            <span className="success-mark"><Check /></span>
            <p className="eyebrow">REPORT SAVED</p>
            <h2 id="report-title">The search starts here.</h2>
            <p>Your report is ready for the campus recovery desk. This preview does not send personal data to a server.</p>
            <button className="button dark" onClick={close}>Back to home</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="eyebrow">{kind === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}</p>
            <h2 id="report-title">{title}</h2>
            <label>Item name<input required placeholder="e.g. Black wireless earbuds" /></label>
            <label>Last seen location<input required placeholder="e.g. Tech Park, second floor" /></label>
            <label>What makes it recognisable?<textarea required rows={3} placeholder="Colour, brand, marks or stickers" /></label>
            <p className="privacy"><ShieldCheck /> Keep private details out of this description.</p>
            <button className="button coral" type="submit">Create report <ArrowRight /></button>
          </form>
        )}
      </section>
    </div>
  );
}

function App() {
  const [report, setReport] = useState<ReportKind | null>(null);

  return (
    <div className="site-shell">
      <header>
        <a className="brand" href="#top" aria-label="LOST DNA home"><Mark /><span>LOST DNA<small>SRM KTR</small></span></a>
        <nav aria-label="Main navigation"><a href="#how">How it works</a><a href="#recent">Recent finds</a></nav>
        <button className="nav-action" onClick={() => setReport('found')}>I found something</button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles /> CAMPUS LOST &amp; FOUND</p>
            <h1>Every lost thing<br />leaves a <em>trail.</em></h1>
            <p className="lede">Retrace where you went, describe the details only you know, and let LOST DNA look for a match across campus.</p>
            <div className="actions">
              <button className="button coral" onClick={() => setReport('lost')}>I lost something <ArrowRight /></button>
              <button className="button paper" onClick={() => setReport('found')}>I found something</button>
            </div>
            <p className="trust"><ShieldCheck /> Private clues stay private. No public contact details.</p>
          </div>
          <div className="trail-card" aria-label="Illustration of a lost item's journey">
            <span className="stamp">LAST SEEN<br /><b>4:35 PM</b></span>
            <svg viewBox="0 0 520 510" role="img" aria-label="A dotted journey across campus">
              <path className="route" d="M66 80 C180 35 165 176 283 154 S435 180 380 276 S176 280 161 384 S338 460 449 394" />
              <circle cx="66" cy="80" r="12" /><circle cx="283" cy="154" r="12" /><circle cx="380" cy="276" r="12" /><circle cx="161" cy="384" r="12" /><circle className="end" cx="449" cy="394" r="19" />
            </svg>
            <div className="item-tag"><span className="bag-icon">⌁</span><div><small>ITEM DNA</small><strong>Black earbuds</strong><span>Electronics · JBL</span></div></div>
            <div className="place-label one"><MapPin /> Tech Park</div>
            <div className="place-label two"><MapPin /> Auditorium</div>
            <p className="map-note">A memory trail, not live tracking.</p>
          </div>
        </section>

        <section className="ticker" aria-label="Platform facts"><span>23 campus places mapped</span><i /> <span>Private ownership checks</span><i /> <span>Built for reunions, not listings</span></section>

        <section className="how" id="how">
          <div><p className="eyebrow">THE RECOVERY ROUTE</p><h2>From “where is it?”<br />to “there it is.”</h2></div>
          <ol>
            <li><b>01</b><span><strong>Rebuild the memory</strong><small>Mark the places you visited and when.</small></span></li>
            <li><b>02</b><span><strong>Create its DNA</strong><small>Add the details that make your item yours.</small></span></li>
            <li><b>03</b><span><strong>Verify &amp; reunite</strong><small>Review likely matches safely through the desk.</small></span></li>
          </ol>
        </section>

        <section className="recent" id="recent">
          <div className="recent-copy"><Search /><p className="eyebrow">RECENTLY SPOTTED</p><h2>Found something?<br />Two minutes can make someone’s day.</h2><button className="text-link" onClick={() => setReport('found')}>Report a found item <ArrowRight /></button></div>
          <div className="found-card"><span className="found-badge">FOUND</span><div className="object-art"><span /><span /></div><p>Electronics</p><h3>Wireless earbuds case</h3><small><MapPin /> Near Auditorium Ground</small><small>Reported Monday, 5:42 PM</small></div>
        </section>
      </main>
      <footer><a className="brand" href="#top"><Mark /><span>LOST DNA<small>SRM KTR</small></span></a><p>Independent student prototype · SRM Kattankulathur</p></footer>
      {report && <ReportPanel kind={report} close={() => setReport(null)} />}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
