import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductPublic from '../ProductPublic';

function renderProductPage(productId = 'prod_01') {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductPublic />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Job 5: Покупатель покупает и получает контент', () => {
  it('показывает информацию о продукте', () => {
    renderProductPage('prod_01');

    expect(screen.getByText('Notion-система для фрилансера')).toBeInTheDocument();
    expect(screen.getByText(/полная система управления/i)).toBeInTheDocument();
  });

  it('показывает цену и кнопку покупки', () => {
    renderProductPage('prod_01');

    // Цена появляется в нескольких местах
    expect(screen.getAllByText(/2[\s\u00a0]490\s*₽/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /купить/i })).toBeInTheDocument();
  });

  it('показывает социальное доказательство', () => {
    renderProductPage('prod_01');

    expect(screen.getByText(/412\+ купили/)).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('показывает гарантии: мгновенный доступ, навсегда, безопасно', () => {
    renderProductPage('prod_01');

    expect(screen.getByText(/мгновенный доступ/i)).toBeInTheDocument();
    expect(screen.getByText(/доступ навсегда/i)).toBeInTheDocument();
    expect(screen.getByText(/безопасная оплата/i)).toBeInTheDocument();
  });

  it('показывает превью контента перед покупкой', () => {
    renderProductPage('prod_01');

    expect(screen.getByText(/что вы получите/i)).toBeInTheDocument();
  });

  it('после покупки показывает контент-ссылку (для продукта с типом link)', async () => {
    const user = userEvent.setup();
    renderProductPage('prod_01');

    await user.click(screen.getByRole('button', { name: /купить/i }));

    expect(screen.getByText(/оплата прошла/i)).toBeInTheDocument();
    expect(screen.getByText(/открыть шаблон в notion/i)).toBeInTheDocument();
  });

  it('после покупки показывает кнопку скачивания (для продукта с типом file)', async () => {
    const user = userEvent.setup();
    renderProductPage('prod_03');

    // Кнопка содержит цену
    const buyButton = screen.getAllByRole('button').find(b => b.textContent.includes('Купить'));
    await user.click(buyButton);

    expect(screen.getByText(/оплата прошла/i)).toBeInTheDocument();
    expect(screen.getByText('Moody_Cinema_Presets.zip')).toBeInTheDocument();
    expect(screen.getByText('24 MB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /скачать файл/i })).toBeInTheDocument();
  });

  it('не требует email для покупки', () => {
    renderProductPage('prod_01');

    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/mail/i)).not.toBeInTheDocument();
  });
});
