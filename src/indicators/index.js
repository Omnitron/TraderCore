class TAIndicators {
  /* 
    label = @string unique name to indentify in the strategy
    updateInterval = @number Candlestick/Tickchart update interval 60,120,180,300
    nameTA = @string Name of the TA script or Talib or Tulipb
    params = @number/object Required parameters
    params2 = @Optional parametes like O,H,L,C,V values for price update 
  */

  constructor(config = { label: 'label', updateInterval: 60, nameTA: 'ema', params: {}, params2: 'ohlcv/4' }) {
    Object.assign(this, config);

    const indicator_base = require(`./custom/${this.nameTA}`);

    this.indicator = new indicator_base(this.params);

    this.result = -1;
    this.lastUpdate = -1;
  }

  update(candle, step) {
    this.lastUpdate = step;

    // Price update
    if (this.indicator.input === 'price') {
      switch (this.params2) {
        case 'open':
          this.indicator.update(candle.open);
          break;
        case 'close':
          this.indicator.update(candle.close);
          break;
        case 'high':
          this.indicator.update(candle.high);
          break;
        case 'low':
          this.indicator.update(candle.low);
          break;
        default:
          // ohlcv/4
          this.indicator.update((candle.open + candle.close + candle.high + candle.low) / 4);
          break;
      }
    } // Candle
    else {
      this.indicator.update(candle);
    }
    this.result = this.indicator.result;
    return this.result;
  }
}

module.exports = TAIndicators;
