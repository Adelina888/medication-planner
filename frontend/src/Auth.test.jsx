import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Auth from './Auth';
import API from './api';

vi.mock('./api');

describe('Авторизация', () => {
  it('отправляет данные и сохраняет токен', async () => {
    API.post.mockResolvedValue({ data: { token: '123', email: 'test@test.com', name: 'Иван' } });
    const mockOnLogin = vi.fn();

    render(<Auth onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Пароль/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: '123' });
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });
});