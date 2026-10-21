import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Light Mode Design Tokens (theme.css)', () => {
  const themeCss = readFileSync(resolve(__dirname, '../src/styles/theme.css'), 'utf-8');

  it('defines [data-theme="light"] selector block', () => {
    expect(themeCss).toMatch(/\[data-theme=['"]?light['"]?\]/);
  });

  it('overrides semantic background surfaces for Light Mode', () => {
    const lightBlockMatch = themeCss.match(/\[data-theme=['"]?light['"]?\]\s*\{([\s\S]*?)\}/);
    expect(lightBlockMatch).not.toBeNull();
    const lightBlock = lightBlockMatch ? lightBlockMatch[1] : '';

    expect(lightBlock).toContain('--bg-canvas:');
    expect(lightBlock).toContain('--bg-surface:');
    expect(lightBlock).toContain('--bg-surface-elevated:');
    expect(lightBlock).toContain('--bg-navbar:');
    expect(lightBlock).toContain('--bg-backdrop:');
  });

  it('overrides semantic typography and contrast colors for Light Mode', () => {
    const lightBlockMatch = themeCss.match(/\[data-theme=['"]?light['"]?\]\s*\{([\s\S]*?)\}/);
    const lightBlock = lightBlockMatch ? lightBlockMatch[1] : '';

    expect(lightBlock).toContain('--text-primary:');
    expect(lightBlock).toContain('--text-secondary:');
    expect(lightBlock).toContain('--color-gold:');
    expect(lightBlock).toContain('--color-accent:');
    expect(lightBlock).toContain('--microscope-diatom:');
    expect(lightBlock).toContain('--microscope-chlorophyll:');
    expect(lightBlock).toContain('--microscope-cyan:');
    expect(lightBlock).toContain('--microscope-fluid-opacity:');
  });

  it('overrides borders and shadows for soft diffuse depth in Light Mode', () => {
    const lightBlockMatch = themeCss.match(/\[data-theme=['"]?light['"]?\]\s*\{([\s\S]*?)\}/);
    const lightBlock = lightBlockMatch ? lightBlockMatch[1] : '';

    expect(lightBlock).toContain('--border-subtle:');
    expect(lightBlock).toContain('--border-gold:');
    expect(lightBlock).toContain('--shadow-card:');
    expect(lightBlock).toContain('--shadow-elevated:');
  });

  it('overrides status operational badges for Light Mode with readable contrast', () => {
    const lightBlockMatch = themeCss.match(/\[data-theme=['"]?light['"]?\]\s*\{([\s\S]*?)\}/);
    const lightBlock = lightBlockMatch ? lightBlockMatch[1] : '';

    expect(lightBlock).toContain('--status-available-bg:');
    expect(lightBlock).toContain('--status-available-text:');
    expect(lightBlock).toContain('--status-maintenance-bg:');
    expect(lightBlock).toContain('--status-maintenance-text:');
    expect(lightBlock).toContain('--status-busy-bg:');
    expect(lightBlock).toContain('--status-busy-text:');
  });
});
