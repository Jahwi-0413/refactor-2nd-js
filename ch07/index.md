# 7. 캡슐화

## 7.1 레코드 캡슐화하기

**before**

```javascript
organization = { name: "애크미 구스베리", country: "GB" };
```

**after**

```javascript
class Organization {
  constructor(data) {
    this._name = data.name;
    this.country = data.country;
  }

  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
  get country() {
    return this._country;
  }
  set coutnry(arg) {
    this._coutnry = arg;
  }
}
```

**배경**
데이터가 가변 데이터인 경우 클래스 객체로 만들면 사용자가 무엇이 저장된 값이고 무엇이 계산된 값인지 알 필요가 없다.
데이터가 불변인 경우에는 그냥 계산된 값을 레코드에 저장하고 이름을 변경해도 필드를 복제한다.

**절차**

1. 레코드를 담은 변수를 캡슐화한다.
2. 레코드를 감싼 단순한 클래스로 해당 변수의 내용을 교체한다. 이 클래스에 원본 레코드를 반환하는 접근자도 정의하고, 변수를 캡슐화하는 함수들이 이 접근자를 사용하도록 수정한다.
3. 테스트한다.
4. 원본 레코드 대신 새로 정의한 클래스 타입의 객체를 반환하는 함수들을 새로 만든다.
5. 레코드를 반환하는 예전 함수를 사용하는 코드를 4. 에서 만든 새 함수를 사용하도록 바꾼다. 필드에 접근할 때는 객체의 접근자를 사용한다. 적절한 접근자가 없다면 추가한다. 한 부분을 바꿀 때마다 테스트한다.
6. 클래스에서 원본 데이터를 반환하는 접근자와 원본 레코드를 반환하는 함수를 제거한다.
7. 테스트한다.
8. 레코드의 필드도 데이터 구조인 중첩 구조라면 레코드 캡슐화하기와 컬렉션 캡슐화하기를 재귀적으로 적용한다.

## 7.2 컬렉션 캡슐화하기

**before**

```javascript
class Person {
  get courses() {
    return this._courses;
  }
  set courses(aList) {
    this._courses = aList;
  }
}
```

**after**

```javascript
class Person {
  get courses() {
    return this._courses.slice();
  }
  addCourse(aCourse){...}
  removeCourse(aCourse){...}
}

```

**배경**
컬렉션을 캡슐화하면서 게터가 컬렉션 자체를 반환하도록 하면, 해당 컬렉션을 감싼 클래스가 모르게 해당 원소들이 바뀌어버릴 수 있기 때문에 조심해야된다.

**절차**

1. 아직 컬렉션을 캡슐화하지 않았다면 변수 캡슐화하기 부터 한다.
2. 컬렉션에 원소를 추가/제거하는 함수를 추가한다.
3. 정적 검사를 수행한다.
4. 컬렉션을 참조하는 부분을 모두 찾는다. 컬렉션의 변경자를 호출하는 코드가 모두 앞에서 추가한 추가/제거 함수를 호출하도록 수정한다. 하나씩 수정할 때마다 테스트한다.
5. 컬렉션 게터를 수정해서 원본 내용을 수정할 수 없는 읽기전용 프락시나 복제본을 반환하게 한다.
6. 테스트한다.

## 7.3 기본형을 객체로 바꾸기

**before**

```javascript
orders.filter((o) => "high" === o.priority || "rush" === o.priority);
```

**after**

```javascript
orders.filter((o) => o.priority.higherThan(new Priority("normal")));
```

**배경**
단순한 정보를 간단한 데이터 항목으로 표시하다가 개발이 진행됨에 따라 포맷팅이나 지역 코드 추출 같은 동작들이 추가되곤 한다.
저자는 단순한 출력 이상의 기능이 필요해지면 그 데이터를 표현하는 전용 클래스를 정의하는 편이라고 한다.

**절차**

1. 아직 변수를 캡슐화하지 않았다면 캡슐화 한다.
2. 단순한 값 클래스를 만든다. 생성자는 기존 값을 인수로 받아서 정의하고, 이 값을 반환하는 게터를 추가한다.
3. 정적 검사를 수행한다.
4. 값 클래스의 인스턴스를 새로 만들어서 필드에 저장하도록 게터를 수정한다. 이미 있다면 필드의 타입을 적절히 변경한다.
5. 새로 만든 클래스의 게터를 호출한 결과를 반환하도록 게터를 수정한다.
6. 테스트한다.
7. 함수 이름을 바꾸면 원본 접근자의 동작을 더 잘 드러낼 수 잇는지 검토한다.

## 7.4 임시 변수를 질의 함수로 바꾸기

**before**

```javascript
const basePrice = this._quntity * this.itemPrice;
if (basePrice > 1000) {
  return basePrice * 0.95;
} else {
  return basePrice * 0.98;
}
```

**after**

```javascript
get basePrice(){return this._quntity * this.itemPrice;}
//...
if (this.basePrice > 1000) {
  return this.basePrice * 0.95;
} else {
  return this.basePrice * 0.98;
}
```

**배경**
여러번 사용될 값을 임시변수에 넣어서 사용하는 경우가 많은데, 이를 함수로 만들어서 사용하는게 나을 때가 많다.
함수로 만들면 해당 로직을 쓸 다른 부분에도 활용할 수 있어서 코드 중복을 줄일 수 있다.
해당 리팩토링은 클래스 안에서 적용할 때 효과가 가장 크다.

자고로 변수는 값을 한 번만 계산하고 그 뒤로는 읽기만 해야 한다.

**절차**

1. 변수가 사용되기 전에 값이 확실히 결정되는지, 변수를 사용할 때마다 계산 로직이 매번 다른 결과를 내지는 않는지 확인한다.
2. 읽기전용으로 만들 수 있는 변수는 읽기전용으로 만든다.
3. 테스트한다.
4. 변수 대입문을 함수로 추출한다.
5. 테스트한다.
6. 변수 인라인하기로 임시 변수를 제거한다.

## 7.5 클래스 추출하기

**before**

```javascript
class Person {
  get officeAreaCode() {
    return this._officeAreaCode;
  }
  get officeNumber() {
    return this._officeNumber;
  }
}
```

**after**

```javascript
class Person {
  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }
  get officeNumber() {
    return this._telephoneNumber.number;
  }
}
class TelephoneNumber {
  get areaCode() {
    return this._areaCode;
  }
  get number() {
    return this._number;
  }
}
```

**배경**
메서드와 데이터가 너무 많은 클래스는 이해하기 힘드니 적절히 분리하기 좋다.
특히 일부 데이터와 메서드를 따로 묶을 수 있다면 어서 분리하라는 신호다.

**절차**

1. 클래스의 역할을 분리할 방법을 정한다.
2. 분리될 역할을 담당할 클래스를 새로 만든다.
3. 원래 클래스의 생성자에서 새로운 클래스의 인스턴스를 생성하여 필드에 저장해둔다.
4. 분리될 역할에 필요한 필드들을 새 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
5. 메서드들도 새 클래스로 옮긴다. 이때 저수준 메서드, 즉 다른 메서드를 호출하기보다는 호출을 당하는 일이 많은 메서드부터 옮긴다. 하나씩 옮길 때마다 테스트한다.
6. 양쪽 클래스의 인터페이스를 살펴보면서 불필요한 메서드를 제거하고, 이름도 새로운 환경에 맞게 바꾼다.
7. 새 클래스를 외부로 노출할지 정한다. 노출하려거든 새 클래스에 참조를 값으로 바꾸기를 적용할지 고민해본다.

## 7.6 클래스 인라인하기

**before**

```javascript
class Person {
  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }
  get officeNumber() {
    return this._telephoneNumber.number;
  }
}
class TelephoneNumber {
  get areaCode() {
    return this._areaCode;
  }
  get number() {
    return this._number;
  }
}
```

**after**

```javascript
class Person {
  get officeAreaCode() {
    return this._officeAreaCode;
  }
  get officeNumber() {
    return this._officeNumber;
  }
}
```

**배경**
클래스 추출하기를 거꾸로 돌리는 리팩토링이다.
더 이상 제 역할을 하지 못하는 클래스는 인라인시킨다.

**절차**

1. 소스 클래스의 각 public 메서드에 대응하는 메서드들을 타깃 클래스에 생성한다. 이 메서드들은 단순히 작업을 소스 클래스로 위임해야 한다.
2. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스에서 위임 메서드를 사용하도록 바꾼다. 하나씩 바꿀 때마다 테스트한다.
3. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스의 위임 메서드를 사용하도록 바꾼다. 하나씩 바꿀 때마다 테스트한다.
4. 소스 클래스를 삭제하고 조의를 표한다.

## 7.7 위임 숨기기

**before**

```javascript
manager = aPerson.department.manager;
```

**after**

```javascript
manager = aPerson.manager;
class Person {
  get manager() {
    return this._department.manager;
  }
}
```

**배경**
캡슐화는 모듈들이 시스템의 다른 부분들에 대해 알아야 할 내용을 줄여준다.
예를들면 서버 객체의 필드가 가리키는 객체의 메서드를 호출하려면 클라이언트는 이 객체를 알아야 한다. 위임 객체의 인터페이스가 바뀌면 이 인터페이스를 사용하는 모든 클라이언트가 코드를 수정해야 한다. 이러한 의존성을 없애려면 서버 자체에 위임 메서드를 만들어서 위임 객체의 존재를 숨기면 된다.

**절차**

1. 위임 객체의 각 메서드에 해당하는 위임 메서드를 서버에 생성한다.
2. 클라이언트가 위임 객체 대신 서버를 호출하도록 수정한다. 하나씩 바꿀 때마다 테스트한다.
3. 모두 수정했다면, 서버로부터 위임 객체를 얻는 접근자를 제거한다.
4. 테스트한다.

## 7.8 중개자 제거하기

**before**

```javascript
manager = aPerson.manager;
class Person {
  get manager() {
    return this._department.manager;
  }
}
```

**after**

```javascript
manager = aPerson.department.manager;
```

**배경**
서버 클래스가 그저 중개자 역할로 전락하면, 클라이언트가 위임 객체를 직접 호출하게 나을수도 있는데, 이때는 중개자를 제거하면 된다.

**절차**

1. 위임 객체를 얻는 게터를 만든다.
2. 위임 메서드를 호출하는 클라이언트가 모두 이 게터를 거치도록 수정한다. 하나씩 바꿀 때마다 테스트한다.
3. 모두 수정했다면 위임 메서드를 삭제한다.

## 7.9 알고리즘 교체하기

**before**

```javascript
function foundPerson(people) {
  for (let i = 0; i < people.length; i++) {
    if (people[i] === "Don") {
      return "Don";
    }
    if (people[i] === "John") {
      return "John";
    }
    if (people[i] === "Kent") {
      return "Kent";
    }
  }
}
```

**after**

```javascript
function foundPerson(people) {
  const candiates = ["Don", "John", "Kent"];
  return people.find((p) => candiates.includes(p)) || "";
}
```

**배경**
알고리즘을 더 간명한 방법을 찾아내면 교체해야한다. 복잡한 대상을 단순한 단위로 나눌 수 있지만, 때로는 알고리즘 전체를 걷어내고 훨씬 간단한 알고리즘으로 바꿔야 할 때가 있다.
**절차**

1. 교체할 코드를 함수 하나에 모은다.
2. 이 함수만을 이용해 동작을 검증하는 테스트를 마련한다.
3. 대체할 알고리즘을 준비한다.
4. 정적 검사를 수행한다.
5. 기존 알고리즘과 새 알고리즘의 결과를 비교하는 테스트를 수행한다. 두 결과가 같다면 리팩터링이 끝난다. 그렇지 않다면 기존 알고리즘을 참고해서 새 알고리즘을 테스트하고 디버깅한다.
