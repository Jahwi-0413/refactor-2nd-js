# 6. 기본적인 리팩터링

## 6.1 함수 추출하기

**배경**

저자는 코드의 길이를 개선을 목적으로 하기보다는 '목적과 구현의 분리'를 목적으로 함수 추출하기 리팩터링을 많이 시행한다.

- before

  ```javascript
  function printOwing(invoice) {
    printBanner();
    let outstanding = calculateOutstanding();

    // 세부 사항 출력
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
  }
  ```

- after

  ```javascript
  function printOwing(invoice) {
    printBanner();
    let outstanding = calculateOutstanding();
    printDetails(outstanding);

    function printDetails(outstanding) {
      console.log(`고객명: ${invoice.customer}`);
      console.log(`채무액: ${outstanding}`);
    }
  }
  ```

**절차**

1. 함수를 새로 만들고 목적이 잘 드러나는 이름을 붙인다.
   추출한 함수가 짧더라도 목적이 더 잘 드러나는 이름을 붙일 수 있다면 추출한다.
2. 추출할 코드를 원본 함수에서 복사해서 붙인다.
3. 추출한 코드 중 원본 함수의 지역 변수를 참조하거나 추출한 함수의 유효 범위를 벗어나는 변수가 없는지 확인한다.
   있다면 매개변수로 전달한다.
4. 변수를 다 처리하고 컴파일을 해본다.
5. 원본 함수에서 추출한 코드를 새로 만든 함수를 호출하는 코드로 바꾼다.
6. 테스트한다.
7. 다른 코드에 방금 추출한 것과 똑같거나 비슷한 코드가 없는지 살핀다. 있다면 방금 만든 함수를 호출할것인지 검토한다.

## 6.2 함수 인라인하기

**배경**
함수 본문이 이름만큼 명확한 경우나 간접 호출을 너무 과하게 쓰는 경우(다른 함수로 위임을 하는 부분이 너무 많아서 위임 관계가 복잡하게 얽힌경우)에는 추출한 함수를 다시 인라인하기도 한다.

**before**

```javascript
function getRating(driver) {
  return morethanFiveLateDeliveries(driver) ? 2 : 1;
}

function moreThanFiveLateDeliveries(driver) {
  return driver.numberOfLateDeliveries > 5;
}
```

**after**

```javascript
function getRating(driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**절차**

1. 다형 메서드인지 확인한다.
2. 인라인할 함수를 호출하는 곳을 모두 찾는다.
3. 각 호출문을 함수 본문으로 교체한다.
4. 하나씩 교체할 때마다 테스트한다.
5. 함수 정의를 삭제한다.

## 6.3 변수 추출하기

**배경**
표현식이 너무 복잡해서 이해하기 어려울 때에는 표현식을 변수로 추출해서 문맥을 더욱 쉽게 파악할 수 있도록 한다.

**before**

```javascript
return (
  order.quntity +
  order.itemPrice -
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
  Math.min(order.quantity + order.itemPrice * 0.1, 100)
);
```

```javascript
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount =
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(basePrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
```

**절차**

1. 추출하려는 표현식에 부장용은 없는지 확인한다.
2. 불변 변수를 하나 선언하고 일므을 붙일 표현식의 복제본을 대입한다.
3. 원본 표현식을 새로 만든 변수로 교체한다.
4. 테스트한다.
5. 표현식을 여러 곳에서 사용한다면 각각을 새로 만든 변수로 교체한다.
   하나 교체할 때마다 테스트한다.

## 6.4 변수 인라인하기

**before**

```javascript
let basePrice = anOrder.basePrice;
return basePrice > 1000;
```

**after**

```javascript
return anOrder.basePrice > 1000;
```

**배경**
변수가 오히려 주변 코드 리팩토링에 방해가 되는 경우에는 인라인하는것이 좋다.

**절차**

1. 대입문의 우변(표현식)에서 부작용이 생기지는 않는지 확인한다.
2. 변수가 불변으로 선언되지 않았다면 불변으로 만든 후 테스트한다.
3. 이 변수를 가장 처음 사용하는 코드를 찾아서 대입문 우변의 코드로 바꾼다.
4. 테스트한다.
5. 변수를 사용하는 부분을 모두 교체할 때까지 이 과정을 반복한다.
6. 변수 선언문과 대입문을 지운다.
7. 테스트한다.

## 6.5 함수 선언 바꾸기

**before**

```javascript
function circum(radius) {}
```

**after**

```javascript
function circumference(radius) {}
```

**배경**
함수는 프로그램을 작은 부분으로 나눠주고 각 부분이 서로 맞물리는 방식을 표현한다.
함수의 매개변수는 함수가 외부 세계와 어우러지는 방식을 정의한다.
매개변수는 함수를 사용하는 문맥을 설정한다. 예를 들어 전화번호 포맷팅 함수가 사람을 매개변수로 받는다면 회사 전화번호 포맷팅에는 사용핳 수 없지만, 전화번호를 매개변수로 받는다면 사용 범위가 넓어지는것이다.

함수 선언과 호출문들을 한번에 고칠 수 있다면 간단한 절차를 따르자.

**간단한 절차**

1. 매개변수를 제거하려거든 먼저 함수 본문에서 제거 대상 매개변수를 참조하는 곳은 없는지 확인한다.
2. 메서드 선언을 원하는 형태로 바꾼다.
3. 기존 메서드 선언을 참조하는 부분을 모두 찾아서 바뀐 형태로 수정한다.
4. 테스트한다.

마이그레이션 절차는 호출문들을 점진적으로 수정할 수 있다. 호출하는 곳이 많거나 호출 과정이 복잡하거나, 호출 대상이 다형 메서드이거나, 선언을 복잡하게 변경할 때에 사용한다.

**마이그레이션 절차**

1. 이어지는 추출 단계를 수월하게 만들어야 한다면 함수의 본문을 적절히 리팩터링한다.
2. 함수 본문을 새로운 함수로 추출한다.
3. 추출한 함수에 매개변수를 추가해야 한다면 '간단한' 절차를 따라 추가한다.
4. 테스트한다.
5. 기존 함수에 새로 만든 함수를 인라인한다.
6. 이름을 임시로 붙여뒀다면 함수 선언 바꾸기를 한 번 더 적용해서 원래 이름으로 되돌린다.
7. 테스트한다.

마이그레이션은 점진적으로 적용할 수 있기 때문에, 삭제 예정인 함수는 deprecated 에정이라고 표시해주는것이 좋다.

## 6.6 변수 캡슐화하기

**before**

```javascript
let defaultOwner = { firstName: "마틴", lastName: "파울러" };
```

**after**

```javascript
let defaultOwnerData = { firstName: "마틴", lastName: "파울러" };
export function defaultOnwer() {
  return defaultOwnerData;
}
export function setDefaultOwner(arg) {
  defaultOwnerData = arg;
}
```

**배경**
접근할 수 있는 범위가 넓은 데이터는 그 데이터로의 접근을 독점하는 함수를 만드는 식으로 캡슐화 해주는게 좋다.
클래스 안에서 필드를 참고할때도 자가 캡슐화를 주장하는 사람도 있지만, 그 정도로 클래스가 크다면 쪼개야하고, 클래스를 쪼갤때는 자가 캡슐화가 도움이 될 수 있다.
불변 데이터는 그냥 필요할때 복제해서 쓰면 된다.
게터로 얻은 데이터를 변경하지 않기를 원한다면 데이터의 복제본을 반환하도록 하면 된다.

**절차**

1. 변수로의 접근과 갱신을 전담하는 캡슐화 함수를 만든다.
2. 정적 검사를 수행한다.
3. 변수를 직접 참조하던 부분을 모두 적절한 캡슐화 함수 호출로 바꾼다. 하나씩 바꿀 때마다 테스트 한다.
4. 변수의 접근 범위를 제한한다.
5. 테스트한다.
6. 변수 값이 레코드라면 레코드 캡슐화하기를 적용할지 고려해본다.

## 6.7 변수 이름 바꾸기

**before**

```javascript
let a = height * width;
```

**after**

```javascript
let area = height * width;
```

**배경**
변수 이름을 바꿀 필요가 있을때는, 개발이 진행됨에 따라 이해도가 높아지거나 사용자의 요구가 달라져 프로그램의 목적이 달라질 때 이다.
이름의 중요성은 사용 범위에 따라 달라질 때가 있다. 람다식 내에 쓰이는 변수는 목적을 명확히 알 수 있도록 한 글자로 사용하기도 한다.

**절차**

1. 폭넓게 쓰이는 변수라면 변수 캡슐화하기를 고려한다.
2. 이름을 바꿀 변수를 참조하는 곳을 모두 찾아서, 하나씩 변경한다.
3. 테스트한다.

## 6.8 매개변수 객체 만들기

**before**

```javascript
function amountInvoiced(startDate, endDate){...}
function amountRecieved(startDate, endDate){...}
```

**after**

```javascript
function amountInvoiced(aDateRange){...}
function amountRecieved(aDateRange){...}
```

**배경**
데이터 뭉치를 데이터 구조로 묶으면 데이터 사이의 관계가 명확해진다.

**절차**

1. 적당한 데이터 구조가 아직 마련되어 있지 않다면 새로 만든다.
2. 테스트한다.
3. 함수 선언 바꾸기로 새 데이터 구조를 매개변수로 추가한다.
4. 테스트한다.
5. 함수 호출 시 새로운 데이터 구조 인스턴스를 넘기도록 수정한다.
6. 기존 매개변수를 사용하던 코드를 새 데이터 구조의 원소를 사용하도록 바꾼다.
7. 다 바꿨다면 기존 매개변수를 제거하고 테스트한다.

## 6.9 여러 함수를 클래스로 묶기

**before**

```javascript
function base(aReading) {}
function taxableChange(aReading) {}
```

**after**

```javascript
class Reading {
  base() {}
  taxableChange() {}
}
```

**배경**
여러 함수를 클래스로 묶으면 함수들이 공유하는 공통 환경을 더 명확히 표현할 수 있고,
각 함수에 전달되는 인수를 줄여서 객체 안에서의 함수 호출을 간결하게 만들 수 있다.

**절차**

1. 함수들이 공유하는 공통 데이터 레코드를 캡슐화한다.
2. 공통 레코드를 사용하는 함수 각각을 새 클래스로 옮긴다.
3. 데이터를 조작하는 로직들은 함수로 추출해서 새 클래스로 옮긴다.

## 6.10 여러 함수를 변환 함수로 묶기

**before**

```javascript
function base(aReading) {}
function taxableChange(aReading) {}
```

**after**

```javascript
function enrichReading(argReading) {
  const aReading = _.cloneDeep(argReading);
  aReading.baseCharge = base(aReading);
  aReading.taxableCharge = taxableCharge(aReading);
  return aReading;
}
```

**배경**
변환 함수는 원본 데이터를 입력 받아서 필요한 정보를 모두 도출해 각각의 출력 데이터 필드에 넣어서 반환하는 함수다.
이 방식 대신 여러 함수를 클래스로 묶기(6.9)로 처리해도 된다.
만약 원본 데이터가 코드 안에서 갱신될 때는 클래스로 묶는 편이 좋다.

**절차**

1. 변환할 레코드를 입력받아서 값을 그대로 반환하는 변환 함수를 만든다.
2. 묶을 함수 중 함수 하나를 골라서 본문 코드를 변환 함수로 옮기고, 처리 결과를 레코드에 새 필드로 기록한다.
   그런 다음 클라이언트 코드가 이 필드를 사용하도록 수정한다.
3. 테스트한다.
4. 나머지 관련 함수도 위 과정에 따라 처리한다.

## 6.11 단계 쪼개기

**before**

```javascript
const orderData = orderString.split(/\s+/);
const productPrice = priceList[orderData[0].split("-")[1]];
const orderPrice = parseInt(orderData[1]) * productPrice;
```

**after**

```javascript
const orderRecord = parseOrder(order);
const productPrice = price(orderRecord, priceList);

function parseOrer(aString) {
  const values = aString.split(/\s+/);
  return { productID: values[0].split("-")[1], quantity: parseInt(values[1]) };
}

function price(order, priceList) {
  return order.quantity * priceList[order.productID];
}
```

**배경**
서로 다른 두 대상을 한꺼번에 다룰 경우에는 각각을 별개 모듈로 나누는 방법을 찾아서 적용하는게 좋다.

**절차**

1. 두 번째 단계에 해당하는 코드를 독립 함수로 추출한다.
2. 테스트한다.
3. 중간 데이터 구조를 만들어서 앞에서 추출한 함수의 인수로 추가한다.
4. 테스트한다.
5. 추출한 두 번째 단계 함수의 매개변수를 하나씩 검토한다. 그중 첫 번째 단계에서 사용되는 것은 중간 데이터 구조로 옮긴다. 하나씩 옮길 때마다 테스트한다.
6. 첫 번째 단계 코드를 함수로 추출하면서 데이터 구조를 반환하도록 만든다.
