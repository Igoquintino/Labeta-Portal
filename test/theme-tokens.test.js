import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Design Tokens Architecture (theme.css)', () => {
  const themeCss = readFileSync(resolve(__dirname, '../src/styles/theme.css'), 'utf-8');

  it('defines semantic surface and text tokens', () => {
    expect(themeCss).toContain('--bg-canvas:');
    expect(themeCss).toContain('--bg-surface:');
    expect(themeCss).toContain('--bg-surface-elevated:');
    expect(themeCss).toContain('--text-primary:');
    expect(themeCss).toContain('--text-secondary:');
    expect(themeCss).toContain('--microscope-diatom:');
    expect(themeCss).toContain('--microscope-chlorophyll:');
    expect(themeCss).toContain('--microscope-cyan:');
    expect(themeCss).toContain('--microscope-fluid-opacity:');
  });

  it('defines status tokens for availability, maintenance and busy states', () => {
    expect(themeCss).toContain('--status-available-bg:');
    expect(themeCss).toContain('--status-available-text:');
    expect(themeCss).toContain('--status-maintenance-bg:');
    expect(themeCss).toContain('--status-maintenance-text:');
    expect(themeCss).toContain('--status-busy-bg:');
    expect(themeCss).toContain('--status-busy-text:');
  });

  it('enforces accessibility typography floor (minimum 0.75rem / 12px)', () => {
    expect(themeCss).toContain('--font-xs: 0.75rem');
    expect(themeCss).toContain('--font-sm: 0.875rem');
    expect(themeCss).toContain('--font-base: 1rem');
    expect(themeCss).toContain('--font-lg: 1.125rem');
    expect(themeCss).toContain('--font-xl: 1.25rem');
    expect(themeCss).toContain('--font-2xl: 1.5rem');
    expect(themeCss).toContain('--font-3xl: 2rem');
  });

  it('defines standardized z-index layers', () => {
    expect(themeCss).toContain('--z-microscope: 0');
    expect(themeCss).toContain('--z-base:');
    expect(themeCss).toContain('--z-sticky:');
    expect(themeCss).toContain('--z-header:');
    expect(themeCss).toContain('--z-drawer:');
    expect(themeCss).toContain('--z-modal:');
    expect(themeCss).toContain('--z-spotlight:');
    expect(themeCss).toContain('--z-admin-bar:');
    expect(themeCss).toContain('--z-toast:');
  });

  it('defines elevation/shadow scale', () => {
    expect(themeCss).toContain('--shadow-subtle:');
    expect(themeCss).toContain('--shadow-card:');
    expect(themeCss).toContain('--shadow-elevated:');
    expect(themeCss).toContain('--shadow-modal:');
  });
});
