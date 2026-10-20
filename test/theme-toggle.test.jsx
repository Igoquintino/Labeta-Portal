import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../src/components/common/ThemeToggle';
import * as themeHook from '../src/context/useTheme';

vi.mock('../src/context/useTheme');

describe('ThemeToggle Component', () => {
  it('renders sun icon and appropriate aria-label when dark mode is active', () => {
    const mockToggle = vi.fn();
    themeHook.useTheme.mockReturnValue({
      theme: 'dark',
      isDark: true,
      toggleTheme: mockToggle,
    });

    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /Alternar para modo claro/i });
    expect(btn).toBeDefined();

    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders moon icon and appropriate aria-label when light mode is active', () => {
    const mockToggle = vi.fn();
    themeHook.useTheme.mockReturnValue({
      theme: 'light',
      isDark: false,
      toggleTheme: mockToggle,
    });

    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /Alternar para modo escuro/i });
    expect(btn).toBeDefined();

    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
