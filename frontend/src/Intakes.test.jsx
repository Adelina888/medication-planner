import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Intakes from './Intakes';
import API from './api';

vi.mock('./api');

describe('Intakes', () => {
  const mockIntake = {
    id: 1, plannedDatetime: '2026-11-25T10:00:00', status: 'PLANNED',
    schedule: { medicine: { name: 'Aspirin', unit: 'mg' }, dosage: '1' }
  };

  it('отображает приёмы', async () => {
    API.get.mockResolvedValue({ data: [mockIntake] });
    render(<Intakes />);
    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());
  });

  it('меняет статус на TAKEN', async () => {
    API.get.mockResolvedValue({ data: [mockIntake] });
    API.patch.mockResolvedValue({ data: { ...mockIntake, status: 'TAKEN' } });
    render(<Intakes />);

    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());
    fireEvent.click(screen.getAllByTitle(/принято/i)[0]);

    await waitFor(() => {
      expect(API.patch).toHaveBeenCalledWith('/intakes/1/status', { status: 'TAKEN' });
    });
  });

  it('фильтрует по статусу', async () => {
    API.get.mockResolvedValue({ data: [mockIntake] });
    render(<Intakes />);
    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'TAKEN' } });
    expect(screen.queryByText('Aspirin')).not.toBeInTheDocument();
  });
});