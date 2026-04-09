import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import Wallet from '../Wallet';

describe('Job 4: Получить деньги (кошелёк)', () => {
  it('показывает баланс доступный к выводу', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/доступно к выводу/i)).toBeInTheDocument();
  });

  it('показывает общий заработок', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/всего заработано/i)).toBeInTheDocument();
  });

  it('показывает сумму выведенных средств', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/выведено/i)).toBeInTheDocument();
  });

  it('показывает кнопку вывода средств', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByRole('button', { name: /вывести средства/i })).toBeInTheDocument();
  });

  it('при нажатии на вывод показывает уведомление', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Wallet />);

    const buttons = screen.getAllByRole('button', { name: /вывести средства/i });
    await user.click(buttons[0]);

    expect(screen.getByText(/заявка на вывод отправлена/i)).toBeInTheDocument();
  });

  it('показывает способ получения (карта)', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/способ получения/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4242/).length).toBeGreaterThanOrEqual(1);
  });

  it('показывает дату следующей выплаты', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/следующая выплата/i)).toBeInTheDocument();
    expect(screen.getByText(/28 апр 2026/i)).toBeInTheDocument();
  });

  it('показывает историю выплат', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/история выплат/i)).toBeInTheDocument();
    expect(screen.getByText(/28 мар 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/28 фев 2026/i)).toBeInTheDocument();
  });

  it('показывает комиссию платформы', () => {
    renderWithProviders(<Wallet />);

    expect(screen.getByText(/комиссия платформы/i)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
