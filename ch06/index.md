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
