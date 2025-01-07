function createStatementData(invoice, plays) {
  const result = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformace),
  };
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function enrichPerformace(aPerformance) {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance); //얕은 복사
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(perf) {
    return plays[perf.playID];
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0;

    switch (this.play.type) {
      case "tragedy": // 비극
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy": //희극
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = 0;
    // 포인트를 정립한다.
    result += Math.max(this.performance.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === this.play.type)
      result += Math.floor(this.performance.audience / 5);

    return result;
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  return new PerformanceCalculator(aPerformance, aPlay);
}

module.exports = { createStatementData };
