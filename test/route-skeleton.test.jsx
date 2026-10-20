import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouteLoadingSkeleton } from '../src/components/common/RouteLoadingSkeleton';

describe('RouteLoadingSkeleton Component', () => {
  it('renders status role with accessible live region', () => {
    render(<RouteLoadingSkeleton />);
    const statusElem = screen.getByRole('status');
    expect(statusElem).toBeDefined();
    expect(statusElem.getAttribute('aria-live')).toBe('polite');
    expect(screen.getByText('Carregando página...')).toBeDefined();
  });

  it('renders custom message if provided', () => {
    render(<RouteLoadingSkeleton message="Carregando dados científicos..." />);
    expect(screen.getByText('Carregando dados científicos...')).toBeDefined();
  });
});
