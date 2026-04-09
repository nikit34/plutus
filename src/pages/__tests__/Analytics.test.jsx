import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import Analytics from '../Analytics';

describe('Job 3: Понять и оптимизировать (аналитика)', () => {
  it('показывает заголовок страницы', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText('Аналитика')).toBeInTheDocument();
  });

  it('показывает 4 ключевые метрики', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText('Общий доход')).toBeInTheDocument();
    // "Продажи" и "Просмотры" появляются и в метриках, и в таблице
    expect(screen.getAllByText('Продажи').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Просмотры').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Конверсия').length).toBeGreaterThanOrEqual(1);
  });

  it('показывает график динамики заработка', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText(/динамика заработка/i)).toBeInTheDocument();
    expect(screen.getByText(/последние 7 месяцев/i)).toBeInTheDocument();
    expect(screen.getByText('Окт')).toBeInTheDocument();
    expect(screen.getByText('Апр')).toBeInTheDocument();
  });

  it('показывает AI-прогноз с потенциалом', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText(/ai-прогноз/i)).toBeInTheDocument();
    expect(screen.getByText(/общий потенциал/i)).toBeInTheDocument();
    expect(screen.getByText(/нереализованный доход/i)).toBeInTheDocument();
  });

  it('показывает доход по продуктам', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText(/доход по продуктам/i)).toBeInTheDocument();
  });

  it('показывает рейтинг конверсии', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText(/лучшая конверсия/i)).toBeInTheDocument();
  });

  it('показывает таблицу детализации продуктов', () => {
    renderWithProviders(<Analytics />);

    expect(screen.getByText(/детализация по продуктам/i)).toBeInTheDocument();
    // Продукт в таблице и в графике дохода
    expect(screen.getAllByText('Notion-система для фрилансера').length).toBeGreaterThanOrEqual(1);
  });
});
