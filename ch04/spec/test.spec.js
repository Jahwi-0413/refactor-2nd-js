const { Province, sampleProvinceData } = require("../index");

// before - 각 테스트가 asia 객체의 참조를 공유함
// describe("province", function () {
//   const asia = new Province(sampleProvinceData());

//   it("shortfall", function () {
//     expect(asia.shortfall).toBe(5);
//   });

//   it("profit", function () {
//     expect(asia.profit).toBe(230);
//   });
// });

// after - 각 테스트마다 새로운 asia 객체 생성
describe("province", function () {
  let asia;

  beforeEach(function () {
    asia = new Province(sampleProvinceData());
  });

  it("shortfall", function () {
    expect(asia.shortfall).toBe(5);
  });

  it("profit", function () {
    expect(asia.profit).toBe(230);
  });

  it("zero demand", function () {
    asia.demand = 0;
    expect(asia.shortfall).toBe(-25);
    expect(asia.profit).toBe(0);
  });

  it("negative demand", function () {
    asia.demand = -1;
    expect(asia.shortfall).toBe(-26);
    expect(asia.profit).toBe(-10);
  });
});

describe("no producers", function () {
  let noProducers;

  beforeEach(function () {
    const data = {
      name: "No Producers",
      producers: [],
      demand: 30,
      price: 20,
    };
    noProducers = new Province(data);
  });

  it("shortfall", function () {
    expect(noProducers.shortfall).toBe(30);
  });
  it("profit", function () {
    expect(noProducers.profit).toBe(0);
  });
});

describe("string for producers", function () {
  it("", function () {
    const data = {
      name: "String producers",
      producers: "",
      demand: 30,
      price: 20,
    };
    const prov = new Province(data);
    expect(prov.shortfall).toBe(0);
  });
});
