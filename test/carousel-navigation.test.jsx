import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CarouselNavigation } from '../src/components/home/CarouselNavigation';

describe('CarouselNavigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCarousel = () => {
    return render(
      <MemoryRouter>
        <CarouselNavigation />
      </MemoryRouter>
    );
  };

  it('renders carousel with proper accessibility roles and title', () => {
    renderCarousel();
    const section = screen.getByRole('region', { name: /Exploração Rápida do LABETA/i });
    expect(section).toBeDefined();
    expect(section.getAttribute('aria-roledescription')).toBe('carousel');

    expect(screen.getByRole('button', { name: /Ver próximo slide/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Ver slide anterior/i })).toBeDefined();
    expect(screen.getByText('Navegação Rápida')).toBeDefined();
  });

  it('renders active center card and side peek cards', () => {
    const { container } = renderCarousel();

    const activeCard = container.querySelector('.carousel-card-item.is-active');
    expect(activeCard).not.toBeNull();
    expect(activeCard.textContent).toContain('Trabalhos e Pesquisas');

    const peekCards = container.querySelectorAll('.carousel-card-item.is-peek');
    expect(peekCards.length).toBeGreaterThanOrEqual(2);

    // Verify pagination dots
    const dots = container.querySelectorAll('.carousel-dot');
    expect(dots.length).toBe(3);
    expect(dots[0].classList.contains('active')).toBe(true);
  });

  it('navigates to next slide when clicking next button', () => {
    const { container } = renderCarousel();

    const nextBtn = screen.getByRole('button', { name: /Ver próximo slide/i });
    fireEvent.click(nextBtn);

    // After clicking next, second dot should become active
    const dots = container.querySelectorAll('.carousel-dot');
    expect(dots[1].classList.contains('active')).toBe(true);
  });

  it('navigates directly to a slide when clicking a pagination dot', () => {
    const { container } = renderCarousel();

    const dots = container.querySelectorAll('.carousel-dot');
    fireEvent.click(dots[2]); // click 3rd dot

    expect(dots[2].classList.contains('active')).toBe(true);
    const activeCard = container.querySelector('.carousel-card-item.is-active');
    expect(activeCard.textContent).toContain('Infraestrutura e Espaço');
  });

  it('allows clicking on a peek card to navigate to it', () => {
    const { container } = renderCarousel();

    const nextPeekCard = container.querySelector('.carousel-card-item.is-next');
    expect(nextPeekCard).not.toBeNull();
    fireEvent.click(nextPeekCard);

    const dots = container.querySelectorAll('.carousel-dot');
    expect(dots[1].classList.contains('active')).toBe(true);
  });
});
