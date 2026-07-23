import type { CVData } from './types';

const NAVY = '#1b2a4a';

/**
 * IIM Calcutta-style CV template.
 *
 * Visual structure:
 *   - Two-column header: institution name left, candidate name + ID right
 *   - Three tag bar (navy banner with the candidate's headline strengths)
 *   - Banded section headers (white text on navy)
 *   - Table-driven education with columns Degree, Board, Score, Year, Remarks
 *   - Two-column category-based blocks for achievements and extracurricular
 *   - Bulleted experience and positions
 */
export function IIMCalTemplate({ data }: { data: CVData }) {
  const p = data.personal;
  const activeTags = p.tags.filter(Boolean);
  const edu = data.education.filter((e) => e.degree);
  const ach = data.achievements.filter((a) => a.items.some((i) => i.text));
  const exp = data.experience.filter((e) => e.company);
  const pos = data.positions.filter((po) => po.role);
  const ec = data.extraCurricular.filter((e) => e.items.some((i) => i.text));
  const comps = data.competitions.filter((c) => c.detail);
  const skills = data.skills.filter((s) => s.text);
  const certs = data.certifications.filter((c) => c.text);
  const projects = data.projects.filter((pr) => pr.title);

  const s: Record<string, React.CSSProperties> = {
    page: {
      fontFamily: '"Times New Roman","Georgia",serif',
      fontSize: '9pt',
      color: '#111',
      background: 'white',
      padding: '18px 22px',
      lineHeight: 1.3,
      boxSizing: 'border-box',
    },
    hdrRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: `2px solid ${NAVY}`,
      paddingBottom: 6,
      marginBottom: 4,
    },
    instName: { fontSize: '11pt', fontWeight: 'bold', color: NAVY },
    instSub: { fontSize: '8pt', color: '#666', fontStyle: 'italic', marginTop: 2 },
    nameBlock: { textAlign: 'right' },
    nameMain: { fontSize: '15pt', fontWeight: 'bold', color: NAVY, letterSpacing: 0.5 },
    nameId: { fontSize: '9pt', color: '#444', marginTop: 1 },
    contact: { fontSize: '8pt', color: '#666', marginTop: 1 },
    tagsBar: {
      background: NAVY,
      color: 'white',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '4px 10px',
      fontSize: '8.5pt',
      fontWeight: 'bold',
      marginBottom: 6,
      letterSpacing: 0.5,
    },
    secHdr: {
      background: NAVY,
      color: 'white',
      padding: '2px 8px',
      fontSize: '9.5pt',
      fontWeight: 'bold',
      letterSpacing: 0.5,
      marginBottom: 0,
    },
    tbl: { width: '100%', borderCollapse: 'collapse', marginBottom: 5, fontSize: '8.5pt' },
    th: {
      border: '1px solid #b0b8c8',
      padding: '2px 5px',
      background: '#e4e8f0',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: '8pt',
    },
    td: { border: '1px solid #b0b8c8', padding: '2px 5px', verticalAlign: 'top' },
    catTd: {
      border: '1px solid #b0b8c8',
      padding: '3px 5px',
      verticalAlign: 'top',
      fontWeight: 'bold',
      fontSize: '8pt',
      width: '18%',
    },
    yearTd: {
      border: '1px solid #b0b8c8',
      padding: '2px 5px',
      verticalAlign: 'top',
      textAlign: 'right',
      whiteSpace: 'nowrap',
      fontSize: '8pt',
      width: '9%',
    },
    blt: { marginBottom: 2, lineHeight: 1.3 },
    expHdr: { display: 'flex', justifyContent: 'space-between', fontSize: '9pt', fontWeight: 'bold', marginTop: 4 },
    expSub: { display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', fontStyle: 'italic', color: '#444', marginBottom: 2 },
    expTag: { fontSize: '7.5pt', background: '#eee', padding: '1px 4px', borderRadius: 2, color: '#444' },
    ul: { paddingLeft: 14, margin: '2px 0 4px 0' },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', marginTop: 2 },
  };

  return (
    <div style={s.page} id="cv-preview-content">
      {/* Header row */}
      <div style={s.hdrRow}>
        <div>
          <div style={s.instName}>{p.institution || 'Sri Venkateswara College'}</div>
          {p.program && <div style={s.instSub}>{p.program}</div>}
        </div>
        <div style={s.nameBlock}>
          {p.name && <div style={s.nameMain}>{p.name.toUpperCase()}</div>}
          {p.rollNumber && <div style={s.nameId}>{p.rollNumber}</div>}
          <div style={s.contact}>{[p.email, p.phone].filter(Boolean).join(' | ')}</div>
          {p.linkedin && <div style={s.contact}>{p.linkedin}</div>}
          {p.portfolio && <div style={s.contact}>{p.portfolio}</div>}
          {p.location && <div style={s.contact}>{p.location}</div>}
        </div>
      </div>

      {activeTags.length > 0 && (
        <div style={s.tagsBar}>
          {activeTags.map((tag, i) => (
            <span key={i}>{tag}</span>
          ))}
        </div>
      )}

      {edu.length > 0 && (
        <>
          <div style={s.secHdr}>ACADEMIC QUALIFICATIONS</div>
          <table style={s.tbl}>
            <thead>
              <tr>
                {['Degree/Exam', 'Board/Institute', '%/CGPA', 'Year', 'Remarks'].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {edu.map((e) => (
                <tr key={e.id}>
                  <td style={s.td}>{e.degree}</td>
                  <td style={s.td}>{e.institution}</td>
                  <td style={{ ...s.td, textAlign: 'center' }}>{e.score}</td>
                  <td style={{ ...s.td, textAlign: 'center' }}>{e.year}</td>
                  <td style={s.td}>{e.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {ach.length > 0 && (
        <>
          <div style={s.secHdr}>ACADEMIC AND PROFESSIONAL ACHIEVEMENTS</div>
          <table style={s.tbl}>
            <tbody>
              {ach.map((group) =>
                group.items
                  .filter((i) => i.text)
                  .map((item, idx) => (
                    <tr key={`${group.id}-${item.id}`}>
                      {idx === 0 ? (
                        <td style={s.catTd} rowSpan={group.items.filter((i) => i.text).length}>
                          {group.category}
                        </td>
                      ) : null}
                      <td style={s.td}>{item.text}</td>
                      <td style={s.yearTd}>{item.year}</td>
                    </tr>
                  )),
              )}
            </tbody>
          </table>
        </>
      )}

      {exp.length > 0 && (
        <>
          <div style={s.secHdr}>WORK EXPERIENCE</div>
          {exp.map((e) => (
            <div key={e.id} style={{ marginBottom: 6 }}>
              <div style={s.expHdr}>
                <span>
                  {e.company}
                  {e.tag && <span style={{ ...s.expTag, marginLeft: 6 }}>{e.tag}</span>}
                </span>
                <span>{e.duration}</span>
              </div>
              <div style={s.expSub}>
                <span>{e.role}</span>
              </div>
              <ul style={s.ul}>
                {e.bullets
                  .filter((b) => b.text)
                  .map((b) => (
                    <li key={b.id} style={s.blt}>{b.text}</li>
                  ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <div style={s.secHdr}>PROJECTS</div>
          {projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 6 }}>
              <div style={s.expHdr}>
                <span>{pr.title}</span>
                <span>{pr.duration}</span>
              </div>
              {pr.context && <div style={s.expSub}><span>{pr.context}</span></div>}
              <ul style={s.ul}>
                {pr.bullets
                  .filter((b) => b.text)
                  .map((b) => (
                    <li key={b.id} style={s.blt}>{b.text}</li>
                  ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {pos.length > 0 && (
        <>
          <div style={s.secHdr}>POSITIONS OF RESPONSIBILITY</div>
          {pos.map((po) => (
            <div key={po.id} style={{ marginBottom: 6 }}>
              <div style={s.expHdr}>
                <span>{po.role}</span>
                <span>{po.year}</span>
              </div>
              <div style={s.expSub}>
                <span>{po.organization}</span>
              </div>
              <ul style={s.ul}>
                {po.bullets
                  .filter((b) => b.text)
                  .map((b) => (
                    <li key={b.id} style={s.blt}>{b.text}</li>
                  ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {ec.length > 0 && (
        <>
          <div style={s.secHdr}>EXTRACURRICULAR ACTIVITIES</div>
          <table style={s.tbl}>
            <tbody>
              {ec.map((group) =>
                group.items
                  .filter((i) => i.text)
                  .map((item, idx) => (
                    <tr key={`${group.id}-${item.id}`}>
                      {idx === 0 ? (
                        <td style={s.catTd} rowSpan={group.items.filter((i) => i.text).length}>
                          {group.category}
                        </td>
                      ) : null}
                      <td style={s.td}>{item.text}</td>
                      <td style={s.yearTd}>{item.year}</td>
                    </tr>
                  )),
              )}
            </tbody>
          </table>
        </>
      )}

      {comps.length > 0 && (
        <>
          <div style={s.secHdr}>COMPETITIONS</div>
          <table style={s.tbl}>
            <tbody>
              {comps.map((c) => (
                <tr key={c.id}>
                  <td style={{ ...s.catTd, fontStyle: 'italic' }}>{c.rank}</td>
                  <td style={s.td}>{c.detail}</td>
                  <td style={s.yearTd}>{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(skills.length > 0 || certs.length > 0) && (
        <>
          <div style={s.secHdr}>SKILLS AND CERTIFICATIONS</div>
          <div style={s.twoCol}>
            {skills.length > 0 && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '8.5pt', marginBottom: 2 }}>Skills</div>
                <ul style={s.ul}>
                  {skills.map((sk) => (
                    <li key={sk.id} style={s.blt}>{sk.text}</li>
                  ))}
                </ul>
              </div>
            )}
            {certs.length > 0 && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '8.5pt', marginBottom: 2 }}>Certifications</div>
                <ul style={s.ul}>
                  {certs.map((c) => (
                    <li key={c.id} style={s.blt}>{c.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
