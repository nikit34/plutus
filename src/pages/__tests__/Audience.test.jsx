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

    it('показывает кнопку подписки со ссылкой креатора', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');

      await user.click(screen.getByRole('button', { name: /купить/i }));

      const link = screen.getByText(/подписаться/i);
      expect(link).toBeInTheDocument();
      expect(link.closest('a').getAttribute('href')).toBeTruthy();
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

    it('показывает название канала', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText(/telegram/i)).toBeInTheDocument();
    });
  });

  describe('Настройки — ссылка на канал', () => {
    it('показывает поле для ссылки на канал', () => {
      renderWithProviders(<Settings />);

      expect(screen.getByText(/ссылка на канал/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/t\.me/i)).toBeInTheDocument();
    });

    it('показывает поле для названия канала', () => {
      renderWithProviders(<Settings />);

      expect(screen.getByPlaceholderText(/название/i)).toBeInTheDocument();
    });

    it('объясняет зачем нужен канал', () => {
      renderWithProviders(<Settings />);

      expect(screen.getByText(/покупатели увидят предложение подписаться/i)).toBeInTheDocument();
    });
  });
});
