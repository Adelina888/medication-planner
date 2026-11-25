import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('создает новое расписание', async () => {
    API.get.mockImplementation(url => {
      if (url === '/schedules') return Promise.resolve({ data: [] });
      if (url === '/medicines') return Promise.resolve({ data: [{ id: 1, name: 'Aspirin' }] });
      return Promise.resolve({ data: [] });
    });
    API.post.mockResolvedValue({ data: { id: 2 } });

    render(<Schedules />);
    
    await waitFor(() => expect(screen.getByRole('button', { name: /Добавить расписание/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Добавить расписание/i }));

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText(/Дозировка/i), { target: { value: '100мг' } });
    fireEvent.change(screen.getByPlaceholderText(/Частота/i), { target: { value: '2 раза в день' } });
    
    fireEvent.change(screen.getByLabelText(/Дата начала:/i), { target: { value: '2026-11-25T12:00' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Сохранить/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/schedules', expect.any(Object));
    });
  });

  it('редактирует расписание', async () => {
    API.get.mockImplementation(url => {
      if (url === '/schedules') return Promise.resolve({ data: [mockSchedule] });
      if (url === '/medicines') return Promise.resolve({ data: [{ id: 1, name: 'Aspirin' }] });
      return Promise.resolve({ data: [] });
    });
    API.put.mockResolvedValue({});
    render(<Schedules />);

    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());


    fireEvent.click(screen.getByTitle(/Редактировать/i));

    fireEvent.change(screen.getByPlaceholderText(/Дозировка/i), { target: { value: '1000мг' } });
    fireEvent.click(screen.getByRole('button', { name: /Сохранить/i }));

    await waitFor(() => {
      expect(API.put).toHaveBeenCalledWith('/schedules/1', expect.any(Object));
    });
  });

  it('удаляет расписание', async () => {
    API.get.mockImplementation(url => {
      if (url === '/schedules') return Promise.resolve({ data: [mockSchedule] });
      if (url === '/medicines') return Promise.resolve({ data: [{ id: 1, name: 'Aspirin' }] });
      return Promise.resolve({ data: [] });
    });
    API.delete.mockResolvedValue({});
    window.confirm = vi.fn(() => true);
    render(<Schedules />);

    await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle(/Удалить/i));

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalledWith('/schedules/1');
      expect(window.confirm).toHaveBeenCalled();
    });
  });
});