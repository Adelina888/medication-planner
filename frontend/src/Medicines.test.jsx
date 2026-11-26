import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Medicines from './Medicines';
import API from './api';

vi.mock('./api');

describe('Medicines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает список лекарств', async () => {
    API.get.mockResolvedValue({ data: [{ id: 1, name: 'Аспирин', form: 'tab', unit: 'mg' }] });
    render(<Medicines />);
    await waitFor(() => expect(screen.getByText('Аспирин')).toBeInTheDocument());
  });

  it('создаёт лекарство', async () => {
    API.get.mockResolvedValue({ data: [] });
    API.post.mockResolvedValue({});
    render(<Medicines />);

    fireEvent.click(screen.getByRole('button', { name: /Создать/i }));
    fireEvent.change(screen.getByPlaceholderText(/Название/i), { target: { value: 'Nurofen' } });
    fireEvent.click(screen.getByRole('button', { name: /Сохранить/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/medicines', expect.objectContaining({ name: 'Nurofen' }));
    });
  });

  it('редактирует лекарство', async () => {
    API.get.mockResolvedValue({ data: [{ id: 1, name: 'Старое', form: 'tab', unit: 'mg' }] });
    API.put.mockResolvedValue({});
    render(<Medicines />);

    await waitFor(() => expect(screen.getByText('Старое')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle(/Редактировать/i));

    fireEvent.change(screen.getByPlaceholderText(/Название/i), { target: { value: 'Новое' } });
    fireEvent.click(screen.getByRole('button', { name: /Сохранить/i }));

    await waitFor(() => {
      expect(API.put).toHaveBeenCalledWith('/medicines/1', expect.objectContaining({ name: 'Новое' }));
    });
  });

  it('удаляет лекарство', async () => {
    API.get.mockResolvedValue({ data: [{ id: 5, name: 'X', form: 'a', unit: 'b' }] });
    API.delete.mockResolvedValue({});
    window.confirm = vi.fn(() => true);
    render(<Medicines />);

    await waitFor(() => expect(screen.getByText('X')).toBeInTheDocument());
    fireEvent.click(screen.getByTitle(/Удалить/i));

    await waitFor(() => expect(API.delete).toHaveBeenCalledWith('/medicines/5'));
  });
});