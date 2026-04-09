import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import Dashboard from '../Dashboard';

describe('Job 2: Понять что нового (лента)', () => {
  it('приветствует креатора по имени', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/привет/i)).toBeInTheDocument();
    expect(screen.getByText(/алексей/i)).toBeInTheDocument();
  });

  it('показывает метрики дня: заработок, продажи, просмотры', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/заработано сегодня/i)).toBeInTheDocument();
    expect(screen.getByText(/продажи сегодня/i)).toBeInTheDocument();
    expect(screen.getByText(/просмотры сегодня/i)).toBeInTheDocument();
  });

  it('показывает процент изменения метрик', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/\+18\.5%/)).toBeInTheDocument();
    expect(screen.getByText(/\+40%/)).toBeInTheDocument();
    expect(screen.getByText(/\+12\.3%/)).toBeInTheDocument();
  });

  it('показывает ленту с событиями продаж', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Лента')).toBeInTheDocument();
    // Продукт может появляться несколько раз в ленте
    expect(screen.getAllByText(/notion-система для фрилансера/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/figma ui kit/i).length).toBeGreaterThanOrEqual(1);
  });

  it('показывает milestone события', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/преодолел 400 продаж/i)).toBeInTheDocument();
  });

  it('показывает AI совет дня', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/совет дня/i)).toBeInTheDocument();
    expect(screen.getAllByText(/повысьте цену/i).length).toBeGreaterThanOrEqual(1);
  });

  it('показывает быстрые действия: создать продукт, аналитика, кошелёк', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/создать новый продукт/i)).toBeInTheDocument();
    expect(screen.getByText(/посмотреть аналитику/i)).toBeInTheDocument();
    expect(screen.getByText(/вывести средства/i)).toBeInTheDocument();
  });
});
