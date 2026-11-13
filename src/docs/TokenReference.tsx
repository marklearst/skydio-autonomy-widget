import { useCssTokens } from './useCssTokens'

const roles = [
  { name: '--color-surface', role: 'Widget and story canvas', swatch: true },
  { name: '--color-surface-raised', role: 'Secondary action controls', swatch: true },
  { name: '--color-surface-hover', role: 'Hover feedback on hover-capable devices', swatch: true },
  { name: '--color-content-primary', role: 'Primary text and icons', swatch: true },
  { name: '--color-content-secondary', role: 'Secondary explanatory text', swatch: true },
  { name: '--color-content-disabled', role: 'Unavailable controls', swatch: true },
  { name: '--color-border-subtle', role: 'Quiet widget boundary', swatch: true },
  { name: '--color-focus-ring', role: 'Visible keyboard focus', swatch: true },
  { name: '--color-action-resume', role: 'Resume action', swatch: true },
  { name: '--color-action-pause', role: 'Pause action', swatch: true },
  { name: '--color-orbit-progress', role: 'Orbit reference and progress', swatch: true },
  { name: '--control-size', role: 'Control target size in this pointer environment' },
  { name: '--widget-height', role: 'Collapsed widget height in this pointer environment' },
  { name: '--widget-expanded-height', role: 'Expanded widget height in this pointer environment' },
  { name: '--text-status', role: 'Mission status type size' },
  { name: '--duration-fast', role: 'Small state feedback' },
  { name: '--duration-normal', role: 'Automatic timer content transition' },
  { name: '--layer-tooltip', role: 'Help text layer' },
]

/** A rendered reference to the real stylesheet, rather than a second token registry. */
export function TokenReference() {
  const values = useCssTokens(roles.map(token => token.name))

  return (
    <div className="widget-docs-table" role="region" aria-label="Live design tokens" tabIndex={0}>
      <table>
        <caption className="widget-docs-caption">Values read from the active stylesheet in this browser.</caption>
        <thead><tr><th scope="col">Semantic token</th><th scope="col">Current value</th><th scope="col">Use</th></tr></thead>
        <tbody>{roles.map(token => (
          <tr key={token.name}>
            <td><code>{token.name}</code></td>
            <td>
              {token.swatch && <span aria-hidden="true" className="widget-token-swatch" style={{backgroundColor: `var(${token.name})`}} />}
              <code>{values[token.name] || 'Reading stylesheet…'}</code>
            </td>
            <td>{token.role}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}
