import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { ThemeProvider } from '../src/context/ThemeContext';
import { useTheme } from '../src/context/useTheme';

describe('ThemeContext and useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const ConsumerComponent = () => {
    const { theme, toggleTheme, isDark } = useTheme();
    return (
      <div>
        <span data-testid="theme-value">{theme}</span>
        <span data-testid="is-dark">{isDark ? 'yes' : 'no'}</span>
        <button type="button" onClick={toggleTheme}>
          Alternar Tema
        </button>
      </div>
    );
  };

  it('initializes with dark theme by default when no localStorage is present', () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(screen.getByTestId('is-dark').textContent).toBe('yes');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('initializes with theme saved in localStorage', () => {
    localStorage.setItem('labeta-theme', 'light');

    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(screen.getByTestId('is-dark').textContent).toBe('no');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles theme between dark and light, updating DOM and localStorage', () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    const toggleBtn = screen.getByRole('button', { name: /Alternar Tema/i });

    // Toggle to light
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('labeta-theme')).toBe('light');

    // Toggle back to dark
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('labeta-theme')).toBe('dark');
  });

  it('throws error when useTheme is called outside ThemeProvider', () => {
    // Suppress console.error in vitest for this expected failure
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow(/useTheme deve ser utilizado dentro de um ThemeProvider/);

    consoleSpy.mockRestore();
  });
});
