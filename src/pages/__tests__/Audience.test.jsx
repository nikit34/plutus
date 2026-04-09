import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/render';
import Dashboard from '../Dashboard';
import ProductPublic from '../ProductPublic';
import Settings from '../Settings';

function renderProductPage(productId = 'prod_01') {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductPublic />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Job: Собрать аудиторию', () => {
  describe('После покупки — подписка на креатора', () => {
    it('после покупки показывает предложение подписаться', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');

      await user.click(screen.getByRole('button', { name: /купить/i }));

      expect(screen.getByText(/подпишитесь на автора/i)).toBeInTheDocument();
    });

    it('показывает имя креатора', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');

      await user.click(screen.getByRole('button', { name: /купить/i }));

      expect(screen.getByText('Алексей Петров')).toBeInTheDocument();
    });

    it('показывает кнопку подписки в Telegram', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');

      await user.click(screen.getByRole('button', { name: /купить/i }));

      const tgLink = screen.getByText(/подписаться в telegram/i);
      expect(tgLink).toBeInTheDocument();
      expect(tgLink.closest('a').getAttribute('href')).toContain('t.me/');
    });

    it('показывает количество подписчиков', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');

      await user.click(screen.getByRole('button', { name: /купить/i }));

      expect(screen.getByText(/1[\s\u00a0]?847\+?\s*подписчиков/i)).toBeInTheDocument();
    });
  });

  describe('Дашборд — виджет аудитории', () => {
    it('показывает виджет аудитории с количеством подписчиков', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText('Аудитория')).toBeInTheDocument();
      expect(screen.getByText(/1[\s\u00a0]?847/)).toBeInTheDocument();
    });

    it('показывает рост подписчиков', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText(/\+12\.4%/)).toBeInTheDocument();
    });

    it('показывает Telegram-канал', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText(/@alexcreator/)).toBeInTheDocument();
    });
  });

  describe('Настройки — Telegram-канал', () => {
    it('показывает поле для Telegram-канала', () => {
      renderWithProviders(<Settings />);

      expect(screen.getByText(/telegram-канал/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/@username/i)).toBeInTheDocument();
    });

    it('объясняет зачем нужен канал', () => {
      renderWithProviders(<Settings />);

      expect(screen.getByText(/покупатели увидят предложение подписаться/i)).toBeInTheDocument();
    });
  });
});
