import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/audio/sound-controller';
import { cn } from '@/lib/utils/cn';

export function Footer() {
  const [soundOn, setSoundOn] = useState(false);
  const [reducedOn, setReducedOn] = useState(false);

  useEffect(() => {
    sound.loadFromStorage();
    setSoundOn(sound.isEnabled());
    setReducedOn(document.body.classList.contains('reduced-motion'));
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    sound.setEnabled(next);
    setSoundOn(next);
  };

  const toggleReduced = () => {
    const next = !reducedOn;
    document.body.classList.toggle('reduced-motion', next);
    setReducedOn(next);
    try { localStorage.setItem('svc-reduced-motion', next ? '1' : '0'); } catch {}
  };

  return (
    <footer className="bg-bg-2 border-t border-line mt-32 relative">
      <div className="container-svc py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logos/svc-crest.png" alt="Sri Venkateswara College crest" className="w-14 h-14" />
              <div className="leading-tight">
                <div className="font-display text-xl text-ink">The Placement Cell</div>
                <div className="font-mono text-xs text-accent tracking-widest uppercase mt-0.5">Sri Venkateswara College</div>
              </div>
            </div>
            <p className="text-sm text-ink-2 max-w-md leading-relaxed mb-5">
              The operational hub for placements, internships, and the Internship Fair. Run by elected
              student leaders with faculty oversight from the Department of Economics.
            </p>
            <address className="not-italic text-sm text-ink-2 leading-relaxed">
              The Placement Cell Room, First Floor<br />
              Durgabai Deshmukh Block<br />
              Sri Venkateswara College, Dhaula Kuan<br />
              Delhi, 110021
            </address>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-4">Reach</h4>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><a className="hover:text-accent transition-colors" href="mailto:placement@svc.ac.in">placement@svc.ac.in</a></li>
              <li className="text-ink-3">Monday to Friday</li>
              <li className="text-ink-3">10:00 to 17:00 IST</li>
            </ul>
            <div className="flex gap-2 mt-5">
              <a href="https://www.instagram.com/placementcell_svc" target="_blank" rel="noopener" aria-label="Instagram" className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300">
                <Instagram size={15} />
              </a>
              <a href="https://www.linkedin.com/company/the-placement-cell-sri-venkateswara-college-delhi-university/" target="_blank" rel="noopener" aria-label="LinkedIn" className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300">
                <Linkedin size={15} />
              </a>
              <a href="https://m.facebook.com/TTDSVCPLACEMENTCELL/" target="_blank" rel="noopener" aria-label="Facebook" className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-ink-2">
              <li>
                <a
                  className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                  href="https://www.svc.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sri Venkateswara College
                  <span aria-hidden="true" className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                  href="https://www.du.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  University of Delhi
                  <span aria-hidden="true" className="text-[10px]">↗</span>
                </a>
              </li>
              <li><Link className="hover:text-accent transition-colors" to="/partnerships">Partnerships</Link></li>
              <li><Link className="hover:text-accent transition-colors" to="/rankings-press">Rankings &amp; Press</Link></li>
              <li><Link className="hover:text-accent transition-colors" to="/resources">Resources</Link></li>
              <li><Link className="hover:text-accent transition-colors" to="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-accent transition-colors" to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-ink-3">
            © {new Date().getFullYear()} The Placement Cell, Sri Venkateswara College, University of Delhi.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className={cn(
                'inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors',
                soundOn ? 'border-accent text-accent bg-accent-soft' : 'border-line text-ink-3 hover:text-accent hover:border-accent',
              )}
              aria-pressed={soundOn}
            >
              {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
              Sound {soundOn ? 'on' : 'off'}
            </button>
            <button
              onClick={toggleReduced}
              className={cn(
                'text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors',
                reducedOn ? 'border-accent text-accent bg-accent-soft' : 'border-line text-ink-3 hover:text-accent hover:border-accent',
              )}
              aria-pressed={reducedOn}
            >
              Reduced motion {reducedOn ? 'on' : 'off'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
