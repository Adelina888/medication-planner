import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Schedules from './Schedules';
import API from './api';

vi.mock('./api');

describe('Schedules', () => {
  const mockSchedule = {
    id: 1, dosage: '500', frequency: 'daily',
    intakeTime: '08:00:00', startDate: '2026-11-01T08:00:00',
    endDate: '2026-12-01T08:00:00', status: 'ACTIVE',
    medicine: { id: 1, name: 'Aspirin', unit: 'mg' }
  };

  it('отображает расписание', async () => {
    API.get.mockImplementation(url => {
      if (url === '/schedules') return Promise.resolve({ data: [mockSchedule] });
      return Promise.resolve({ data: [] });
    });
    render(<Schedules />);
    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());
  });

  it('фильтрует по времени', async () => {
    API.get.mockImplementation(url => {
      if (url === '/schedules') return Promise.resolve({ data: [mockSchedule] });
      return Promise.resolve({ data: [] });
    });
    render(<Schedules />);
    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Время приема/i), { target: { value: '08:00' } });
    expect(screen.getByText('Aspirin')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Время приема/i), { target: { value: '23:00' } });
    expect(screen.queryByText('Aspirin')).not.toBeInTheDocument();
  });
});