import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BrutalButton from '../../../src/components/brutal/BrutalButton';

describe('BrutalButton', () => {
  it('renders with children', () => {
    render(<BrutalButton>Click Me</BrutalButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<BrutalButton>Default</BrutalButton>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-black');
  });

  it('applies primary variant classes', () => {
    render(<BrutalButton variant="primary">Primary</BrutalButton>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-brand-accent');
    expect(button).toHaveClass('text-white');
  });

  it('applies danger variant classes', () => {
    render(<BrutalButton variant="danger">Danger</BrutalButton>);
    const button = screen.getByText('Danger');
    expect(button).toHaveClass('bg-semantic-negative');
  });

  it('applies correct size classes', () => {
    render(<BrutalButton size="sm">Small</BrutalButton>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<BrutalButton onClick={handleClick}>Click</BrutalButton>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<BrutalButton disabled>Disabled</BrutalButton>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('applies brutalist shadow classes', () => {
    render(<BrutalButton>Shadow</BrutalButton>);
    const button = screen.getByText('Shadow');
    expect(button).toHaveClass('shadow-brutal');
  });
});
