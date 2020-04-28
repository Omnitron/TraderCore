/* eslint-disable prefer-destructuring */
import { logger } from '../logger';

import { Emulator } from './emulator';
import { BacktestEmulatorInit, Simulation } from '../types';
import { DEFAULT_BACKTEST_ARRAY_LIMIT } from '../constants';

export class BacktestEmulator {
  simulation?: Simulation;
  performance: number;
  historyOrders: any[];
  backTestArrayLimit: number;
  config?: BacktestEmulatorInit;

  constructor(backTestArrayLimit?: number) {
    this.backTestArrayLimit = backTestArrayLimit ?? DEFAULT_BACKTEST_ARRAY_LIMIT;

    this.performance = 0;
    this.historyOrders = [];
  }

  // Start backtest instances
  async start(config: BacktestEmulatorInit): Promise<void> {
    try {
      this.config = config;
      const symbol = config.symbol; // 'BTC/USDT';
      const exchange = config.exchange; // 'binance';
      const strategy = config.strategy; // 'bb_pure';
      const strategyConfig = config.strategyConfig; // {};
      const traderConfig = config.traderConfig; // {};
      const intervals = config.intervals; // [60,300]
      const candledata = config.candledata; // [];

      this.simulation = {
        symbol,
        exchange,
        strategy,
        emulator: new Emulator({
          exchange,
          symbol,
          strategy,
          strategyConfig,
          intervals,
          traderConfig,
        }),
      };

      // Start and load first chunk of candle datas into the strategy
      await this.simulation.emulator.start(candledata);

      logger.verbose(
        `Backtest emulator loaded successfully, Strategy: ${strategy}, Candledata length: ${candledata.size}`,
      );

      this.historyOrders = this.simulation.emulator.TradeEmulator?.historyOrders ?? [];

      this.performance = this.simulation.emulator.TradeEmulator?.getFullBalance() || 0;

      return;
    } catch (e) {
      logger.error('Backtest Emulator error ', e);
    }
  }
}
