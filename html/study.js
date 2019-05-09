//평균구하기
//1.for문
function solutionAverageA(arr) {
    var answer = 0,
        sum = 0,
        len = arr.length;

    for (var i = 0; i < len; i++) {
        sum += arr[i];
    }

    answer = sum / len;

    return answer;
}
//2.reduce() Method
//array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
function solutionAverageB(arr) {
    var answer = 0,
        len = arr.length,
        sum = arr.reduce(function getSum(a, b) { return a + b;});

    answer = sum / len;

    return answer;
}

function solutionAverageB_(arr) {
    return arr.reduce((a, b) => {return a + b}) / arr.length;
}


//짝수홀수 구하기
function solutionOddEven(num) {
    var answer = '';

    if (num % 2 === 0) {
        answer = 'Even';
    } else {
        answer = 'Odd';
    }

    return answer;
}
function solutionOddEven_(num) {
    return num % 2 === 0 ? 'Even' : 'Odd';
}


//가운데글자가져오기
function solutionCenterText(s) {
    var answer = '';

    if (s.length % 2 !== 0) {
        answer = s[Math.floor(s.length / 2)];
    } else {
        answer = s[s.length / 2 - 1] + s[s.length / 2]
    }

    return answer;
}
function solutionCenterText_(s) {
    return s.length % 2 !==0 ? s[Math.floor(s.length / 2)] : s[s.length / 2 - 1] + s[s.length / 2];
    //substr
    // return s.length % 2 !==0 ? s.substr(Math.floor(s.lenght / 2), 1) : s.substr(s.length / 2 - 1, 2);
}
//참고
Math.floor(x); // x값에 대하여 올림
Math.ceil(x); // x값에 대하여 내림
Math.round(x) // x값에 대하여 반올림
string.substr(start, length) //문자열에 대하여 시작점(start)부터의 문자수(length)만큼 반환


//문자열 정수로
function solutionNumber(s) {
    var answer = 0;
    return answer = Number(s);
}


//배열찾기
function solutionArraySearch(s) {
    return '찾는 건 ' + s.indexOf('kim') + '이다.'
}
//arr.indexOf(searchElement[, fromIndex])
//indexOf() 메서드는 배열에서 지정된 요소를 찾을 수있는 첫 번째 인덱스를 반환하고 존재하지 않으면 -1을 반환합니다.
//str.indexOf(searchElement[, fromIndex])
//indexOf() 메서드는 호출한 String 객체에서 특정 값의 첫 번째 일치하는 인덱스를 반환합니다. 일치하는 값이 없으면 -1을 반환합니다.


//약수의 합
function solutionAllquot(n) {
    var answer = 0;

    for (var i = 0; i <= n; i++) {
        if (n % i === 0) {
            answer += i;
        }
    }

    return answer;
}


//date
function solutionDateArray(y, m, d) {
    var answer = '',
        week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    answer = week[new Date(y, m - 1, d).getDay()];

    return answer;
}
function solutionDateString(y, m, d) {
    var answer = '',
        date = new Date(y, m - 1, d);

    answer = date.toDateString().toUpperCase();

    return answer;
}
/*
new Date(year, monthIndex, day, hour, minutes, seconds, milliseconds);
monthIndex는 달을 나타내는 정수, (0은 1월 ~ 11은 12월)

getDay()
지정된 날짜의 요일을 반환  (일요일은 0, 월요일은 1, 화요일은 2, ...)


//주어진 날짜를 문자열로 반환하기
var d = new Date(1993, 6, 28, 14, 39, 7);

d.toString; // Wed Jul 28 1993 14:39:07 GMT+0900 (한국 표준시)
d.toDateString; // Wed Jul 28 1993
d.toTimeString; // 14:39:07 GMT+0900 (한국 표준시)
*/


//두 정수 사이의 합
function solutionSum(a, b) {
    var answer = 0,
        max = Math.max(a, b),
        min = Math.min(a, b);

    for (var i = min; i <= max; i++) {
        answer += i;
    }

    return answer;
}


//핸드폰번호가리기
function solutionPhoneHide(phone_number) {
    var newStr = '';

    for (var i = 0; i > phone_number.length - 4; i++) {
        newStr += '*';
    }
    newStr += phone_number.slice(-4);

    return newStr;
}
function solutionPhoneHideRepeat(phone_number) {
    var answer = '';

    answer = '*'.repeat(phone_number.length - 4) + phone_number.slice(-4);

    return answer;
}
function solutionPhoneHideReplace(phone_number) {
    var answer = '';

    answer = phone_number.replace(/\d(?=\d{4})/g, '*');

    return answer;
}


//나누어 떨어지는 숫자 배열
function solutionArrayDivide(arr, divisor) {
    var answer = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] % divisor === 0) {
            answer.push(arr[i]);
        }
    }

    answer.length === 0 ? answer.push(-1) : answer.sort((a, b) => a -b);

    return answer;
}


//문자열 내 특정 문자 개수 찾기
function solutionTextSearch(s, t) {
    var answer = true,
        p = 0;

    for (var i = 0; i < s.length; i++) {
        if (s[i] === t.toUpperCase() || s[i] === t.toLowerCase()) {
            p++;
        }
    }

    if (p === 0) {
        answer = false;
    }

    return p;
}







