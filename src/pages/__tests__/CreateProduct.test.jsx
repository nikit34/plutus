import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import CreateProduct from '../CreateProduct';

describe('Job 1: Создать продукт и получить ссылку', () => {
  it('показывает форму создания с обязательными полями', () => {
    renderWithProviders(<CreateProduct />);

    expect(screen.getByPlaceholderText(/notion-система/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/опишите ваш продукт/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('2490')).toBeInTheDocument();
  });

  it('показывает выбор типа контента: файл, ссылка, текст', () => {
    renderWithProviders(<CreateProduct />);

    expect(screen.getByText('Файл')).toBeInTheDocument();
    expect(screen.getByText('Ссылка')).toBeInTheDocument();
    expect(screen.getByText('Текст')).toBeInTheDocument();
  });

  it('переключает тип контента и показывает соответствующие поля', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    // По умолчанию — файл
    expect(screen.getByPlaceholderText(/presets\.zip/i)).toBeInTheDocument();

    // Переключить на ссылку
    await user.click(screen.getByText('Ссылка'));
    expect(screen.getByPlaceholderText(/notion\.so/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/текст кнопки/i)).toBeInTheDocument();

    // Переключить на текст
    await user.click(screen.getByText('Текст'));
    expect(screen.getByPlaceholderText(/инструкции, коды доступа/i)).toBeInTheDocument();
  });

  it('не создаёт продукт без названия и цены', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.click(screen.getByRole('button', { name: /создать продукт/i }));

    // Ссылка не должна появиться
    expect(screen.queryByText(/ссылка готова/i)).not.toBeInTheDocument();
  });

  it('создаёт продукт и показывает ссылку для копирования', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.type(screen.getByPlaceholderText(/notion-система/i), 'Мой курс');
    await user.type(screen.getByPlaceholderText('2490'), '1990');
    await user.click(screen.getByRole('button', { name: /создать продукт/i }));

    expect(screen.getByText(/ссылка готова/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /копировать/i })).toBeInTheDocument();
  });

  it('показывает live-превью с названием и ценой', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);

    await user.type(screen.getByPlaceholderText(/notion-система/i), 'Тестовый продукт');
    await user.type(screen.getByPlaceholderText('2490'), '3000');

    expect(screen.getByText('Тестовый продукт')).toBeInTheDocument();
    const priceMatches = screen.getAllByText(/3[\s\u00a0]000\s*₽/);
    expect(priceMatches.length).toBeGreaterThanOrEqual(1);
  });

  it('показывает выбор темы оформления', () => {
    renderWithProviders(<CreateProduct />);

    expect(screen.getByText('Midnight')).toBeInTheDocument();
    expect(screen.getByText('Aurora')).toBeInTheDocument();
    expect(screen.getByText('Snow')).toBeInTheDocument();
  });
});
