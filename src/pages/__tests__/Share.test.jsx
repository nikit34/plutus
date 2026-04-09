import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import CreateProduct from '../CreateProduct';

describe('Job: Быстро поделиться ссылкой в соцсетях', () => {
  it('после создания продукта показывает кнопки шаринга', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.type(screen.getByPlaceholderText(/notion-система/i), 'Тест');
    await user.type(screen.getByPlaceholderText('2490'), '1000');
    await user.click(screen.getByRole('button', { name: /создать продукт/i }));

    expect(screen.getByText(/поделиться/i)).toBeInTheDocument();
  });

  it('показывает ссылки на Telegram, WhatsApp, X, VK', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.type(screen.getByPlaceholderText(/notion-система/i), 'Тест');
    await user.type(screen.getByPlaceholderText('2490'), '1000');
    await user.click(screen.getByRole('button', { name: /создать продукт/i }));

    expect(screen.getByTitle('Telegram')).toBeInTheDocument();
    expect(screen.getByTitle('WhatsApp')).toBeInTheDocument();
    expect(screen.getByTitle('X')).toBeInTheDocument();
    expect(screen.getByTitle('VK')).toBeInTheDocument();
  });

  it('кнопка "Текст + ссылка" копирует форматированный текст', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.type(screen.getByPlaceholderText(/notion-система/i), 'Тест');
    await user.type(screen.getByPlaceholderText('2490'), '1000');
    await user.click(screen.getByRole('button', { name: /создать продукт/i }));

    const copyBtn = screen.getByRole('button', { name: /текст \+ ссылка/i });
    expect(copyBtn).toBeInTheDocument();
  });

  it('ссылки на соцсети содержат правильные URL', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.type(screen.getByPlaceholderText(/notion-система/i), 'Мой продукт');
    await user.type(screen.getByPlaceholderText('2490'), '500');
    await user.click(screen.getByRole('button', { name: /создать продукт/i }));

    const tgLink = screen.getByTitle('Telegram');
    expect(tgLink.getAttribute('href')).toContain('t.me/share');

    const waLink = screen.getByTitle('WhatsApp');
    expect(waLink.getAttribute('href')).toContain('wa.me');
  });
});
