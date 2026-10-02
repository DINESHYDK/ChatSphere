import React from 'react';

const Vis = () => {
  return (
    <div>
      <section className="slide">
        <div className="header-meta r1">
          <span className="role-eyebrow">Data Model &amp; Architecture</span>
          <span className="tag-badge">UML Class Model</span>
        </div>

        <div className="header-block r1" style={{ marginBottom: '28px' }}>
          <h2 className="role-title">
            Core Domain <span className="title-highlight">Class Diagram</span>
          </h2>
        </div>

        <div 
          className="r2" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '460px 1fr', 
            gap: '36px', 
            flex: '1 1 0%', 
            minHeight: '0px', 
            animationDuration: '0.01ms', 
            animationDelay: '0s', 
            animationIterationCount: '1' 
          }}
        >
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRight: '1px solid var(--border-soft)', paddingRight: '36px' }}>
            <div>
              <div className="role-mono" style={{ fontSize: '20px', color: 'var(--accent)', marginBottom: '8px' }}>01 / STRUCTURAL RULES</div>
              <p className="role-body-dense">
                Hierarchical taxonomy where <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Category</code> contains nested sub-categories recursively, housing multiple components.
              </p>
            </div>

            <div className="rule-sep" style={{ margin: 0 }}></div>

            <div>
              <div className="role-mono" style={{ fontSize: '20px', color: 'var(--accent)', marginBottom: '8px' }}>02 / MULTIPLICITIES</div>
              <table className="table-matrix" style={{ fontSize: '22px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0', fontFamily: 'var(--font-mono)', fontWeight: 600, width: '150px' }}>Category : Component</td>
                    <td style={{ padding: '6px 0' }}>1 to 1..*</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Component : Keyword</td>
                    <td style={{ padding: '6px 0' }}>1 to 0..* (via ReuseInfo)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Component : UsageStat</td>
                    <td style={{ padding: '6px 0' }}>1 to 1 (audit log)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rule-sep" style={{ margin: 0 }}></div>

            <div>
              <div className="role-mono" style={{ fontSize: '20px', color: 'var(--accent)', marginBottom: '8px' }}>03 / ACTOR HIERARCHY</div>
              <p className="role-body-dense">
                Abstract <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>User</code> specializes into <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Cataloguer</code> (curator) and <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>CatalogueUser</code> (searches with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Query</code>).
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Grid Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 300px 320px 240px', gap: '16px', alignItems: 'start' }}>
              
              <div className="frame-box accent-top" style={{ padding: '16px' }}>
                <div className="role-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '6px', marginBottom: '6px' }}>Category</div>
                <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '16px', lineHeight: 1.35 }}>
                  - categoryId: String<br />
                  - name: String<br />
                  - parentCategory: Category
                </div>
                <div style={{ borderTop: '1px solid var(--hair)', marginTop: '6px', paddingTop: '6px' }} className="role-caption">
                  + getSubCategories()<br />
                  + getComponents()
                </div>
              </div>

              <div className="frame-box accent-top" style={{ padding: '16px' }}>
                <div className="role-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '6px', marginBottom: '6px' }}>Component</div>
                <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '16px', lineHeight: 1.35 }}>
                  - componentId: String<br />
                  - name: String<br />
                  - type: Design | Code
                </div>
                <div style={{ borderTop: '1px solid var(--hair)', marginTop: '6px', paddingTop: '6px' }} className="role-caption">
                  + getDetails(): Spec<br />
                  + getUsageStat()
                </div>
              </div>

              <div className="frame-box" style={{ padding: '16px' }}>
                <div className="role-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '6px', marginBottom: '6px' }}>UsageStatistic</div>
                <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '16px', lineHeight: 1.35 }}>
                  - timesUsed: int<br />
                  - timesQueriedNotUsed: int<br />
                  - lastUsedOn: Date
                </div>
                <div style={{ borderTop: '1px solid var(--hair)', marginTop: '6px', paddingTop: '6px' }} className="role-caption">
                  + recordAccess(used: bool)<br />
                  + getSummary(): Metric
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="frame-box" style={{ padding: '14px' }}>
                  <div className="role-mono" style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '4px', marginBottom: '4px' }}>ReuseInfo</div>
                  <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '15px', lineHeight: 1.3 }}>
                    - description: String<br />
                    - notation: String
                  </div>
                </div>
                <div className="frame-box" style={{ padding: '14px' }}>
                  <div className="role-mono" style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '4px', marginBottom: '4px' }}>Keyword</div>
                  <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '15px', lineHeight: 1.3 }}>
                    - term: String<br />
                    - weight: float
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'var(--surface-alt)', border: '1px dashed var(--border-soft)', height: '42px' }}>
              <span className="role-caption" style={{ color: 'var(--accent)', fontWeight: 600 }}>1 (Category) ─── contains ─── 1..* (Component)</span>
              <span className="role-caption" style={{ color: 'var(--accent)', fontWeight: 600 }}>1 (Component) ─── tracks ─── 1 (UsageStat)</span>
              <span className="role-caption" style={{ color: 'var(--accent)', fontWeight: 600 }}>1 (Component) ─── 0..* (Keyword via ReuseInfo)</span>
            </div>

            {/* Bottom Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: '20px', alignItems: 'start' }}>
              
              <div className="frame-box" style={{ padding: '16px' }}>
                <div className="role-mono" style={{ fontSize: '18px', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '6px', marginBottom: '6px' }}>«abstract» User</div>
                <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '16px', lineHeight: 1.35 }}>
                  - userId: String<br />
                  - userName: String
                </div>
                <div style={{ borderTop: '1px solid var(--hair)', marginTop: '6px', paddingTop: '6px' }} className="role-caption">
                  + login()<br />
                  + logout()
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="frame-box" style={{ padding: '14px', borderLeft: '3px solid var(--ink)' }}>
                  <div className="role-mono" style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Cataloguer</div>
                  <div className="role-caption" style={{ fontSize: '15px', lineHeight: 1.3 }}>
                    + registerComponent()<br />
                    + removeComponent()<br />
                    + linkKeywords()
                  </div>
                </div>

                <div className="frame-box" style={{ padding: '14px', borderLeft: '3px solid var(--ink)' }}>
                  <div className="role-mono" style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>CatalogueUser</div>
                  <div className="role-caption" style={{ fontSize: '15px', lineHeight: 1.3 }}>
                    + searchByKeyword()<br />
                    + browseCategory()<br />
                    + submitQuery()
                  </div>
                </div>
              </div>

              <div className="frame-box accent-top" style={{ padding: '16px' }}>
                <div className="role-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--hair)', paddingBottom: '6px', marginBottom: '6px' }}>Query</div>
                <div className="role-caption" style={{ color: 'var(--ink-secondary)', fontSize: '16px', lineHeight: 1.35 }}>
                  - queryText: String<br />
                  - matchedKeywords: List
                </div>
                <div style={{ borderTop: '1px solid var(--hair)', marginTop: '6px', paddingTop: '6px' }} className="role-caption">
                  + execute(): List&lt;Component&gt;<br />
                  + logOutcome(used: bool)
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vis;