let students = [];
const formChilds = document.querySelector('.form').getElementsByTagName('input');
const tbody = document.querySelector('tbody');
let counterName = 0;
let counterFaculty = 0;
let counterdDate = 0;
let counterStart = 0;

// функция показывает текст ошибки и красит бордер в красный.
function inputIsNotValid(styleClass, index) {

  document.querySelector(styleClass).style.display = 'block';
  formChilds[index].classList.add('border-red');
  return true;
}

// функция скрывает текст ошибки и удаляет красный цвет у бордера.
function inputIsValid(styleClass, index) {

  formChilds[index].classList.remove('border-red');
  document.querySelector(styleClass).style.display = 'none';
  return false;
}

// функция создает объект student из данных формы, добавляет объект в массив студентов и вызывает функцию создания таблицы
function addStudent() {
  const student = {
    name: formChilds[0].value,
    surName: formChilds[1].value,
    patronymic: formChilds[2].value,
    dateOfBirth: new Date(formChilds[3].value),
    startTrining: formChilds[4].value,
    faculty: formChilds[5].value
  };
  formChilds.forEach((elem) => { elem.value = ''; });

  students.push(student);
  createTable(students);
}

// фунция создает таблицу
function createTable(students) {
  clearTable();  //  чистим таблицу

  students.forEach((elem) => {
    const tr = document.createElement('tr');
    tr.classList.add('tr');

    normalizeFormat(elem)
      .forEach((el) => {
        const td = document.createElement('td');
        td.textContent = el;
        tr.append(td);
      });
    tbody.append(tr)
  });
}

// функция форматирует свойства объекта. Возвращает массив.
function normalizeFormat(obj) {
  const result = [];
  result.push(`${obj.surName} ${obj.name} ${obj.patronymic}`);
  result.push(obj.faculty);
  result.push(calculAge(obj.dateOfBirth));
  result.push(calculCourse(obj.startTrining))

  return result;
}

// функция форматирует объект Date в строку.
function calculAge(date) {
  const month = Number(date.getMonth()) + 1 >= 10 ? Number(date.getMonth() + 1) : '0' + Number(date.getMonth() + 1);
  const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
  const birth = `${day}.${month}.${date.getFullYear()}`;
  const age = (new Date().getTime() - date) / (24 * 3600 * 365.25 * 1000) | 0;  // вычисляет возраст.

  return `${birth} (${age} ${calculSrtingAfterDate(age)}`;
}

// функция вычисляет в ячейке "ДР и возраст" валидную строку после возраста.
function calculSrtingAfterDate(age) {
  switch (age % 10) {
    case 2:
    case 3:
    case 4:
      return (age / 10 % 10) !== 1 ? ` года)` : ` лет)`;
    case 1:
      return (age / 10 % 10) !== 1 ? ` год)` : ` лет)`;
    default:
      return ` лет)`;
  }
}

// вычисляет курс
function calculCourse(start) {
  let period = `${start}-${Number(start) + 4}`;
  const course = (new Date().getFullYear() - start);

  if (course < 4 || (course == 4 && new Date().getMonth() + 1 <= 9)) {  // если курс меньше или равен 4 и сентябрь еще не прошел
    period += ` (${course} курс)`;
  }
  else if (course >= 4) {
    period += ` (закончил)`;
  }
  return period;
}

// удаляет таблицу
function clearTable() {
  tbody.textContent = '';
}

//  сортирует таблицу
function sortTable(index) {
  const sortStudents = [];
  students.forEach((el, i) => { sortStudents[i] = Object.assign({}, el) });  // чтобы не менять исходный массив создаем копию

  switch (index) {
    case 0:
      counterName++;
      if (counterName % 2 !== 0) {
        sortStudents.sort((a, b) => a.surName + a.name + a.patronymic < b.surName + b.name + b.patronymic ? -1 : 1);
      }
      else {
        sortStudents.sort((a, b) => a.surName + a.name + a.patronymic > b.surName + b.name + b.patronymic ? -1 : 1);
      }
      break;
    case 1:
      counterFaculty++;
      if (counterFaculty % 2 !== 0) {
        sortStudents.sort((a, b) => a.faculty < b.faculty ? -1 : 1);
      }
      else {
        sortStudents.sort((a, b) => a.faculty > b.faculty ? -1 : 1);
      }
      break;
    case 2:
      counterdDate++;
      if (counterdDate % 2 !== 0) {
        sortStudents.sort((a, b) => a.dateOfBirth - b.dateOfBirth);
      }
      else {
        sortStudents.sort((a, b) => b.dateOfBirth - a.dateOfBirth);
      }
      break;
    case 3:
      counterStart++;
      if (counterStart % 2 !== 0) {
        sortStudents.sort((a, b) => a.startTrining - b.startTrining);
      }
      else {
        sortStudents.sort((a, b) => b.startTrining - a.startTrining);
      }
      break;
  }
  createTable(sortStudents);
}

function search(index) {
  const filters = document.querySelector('.filters').getElementsByTagName('input');
  const fromInputStr = filters[index].value.toUpperCase().trim();
  const found = [];

  switch (index) {
    case 0:
      students.forEach((el) => {
        const str = (el.name + el.surName + el.patronymic).toUpperCase();
        if (str.search(fromInputStr) > -1) {
          found.push(Object.assign({}, el));
        }
      });
      break;
    case 1:
      students.forEach((el) => {
        const str = el.faculty.toUpperCase();
        if (str.search(fromInputStr) > -1) {
          found.push(Object.assign({}, el));
        }
      });
      break;
    case 2:
      students.forEach((el) => {
        const str = el.startTrining;
        if (str == fromInputStr || fromInputStr === '') {
          found.push(Object.assign({}, el));
        }
      });
      break;
    case 3:
      students.forEach((el) => {
        const str = Number(el.startTrining) + 4;
        if (str == fromInputStr || fromInputStr === '') {
          found.push(Object.assign({}, el));
        }
      });
      break;
  }
  createTable(found);
}

// в зависимости от того есть ли совпадения, добавляет элемент в нужный массив.
function searchByNumber(str, el, target, found, dontFound) {
  if (str == target) {
    found.push(Object.assign({}, el));
  }
  else {
    dontFound.push(Object.assign({}, el));
  }
}

function searchByString(str, el, target, found, dontFound) {
  if (str.search(target) > -1) {
    found.push(Object.assign({}, el));
  }
  else {
    dontFound.push(Object.assign({}, el));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  let notEmpty = false;
  let dateValid = false;
  let yearValid = false;

  document.querySelectorAll('.filter').forEach((e, index) => {
    e.addEventListener('input', () => search(index));
  });
  document.querySelectorAll("[data-target='sort']").forEach((e, index) => {
    e.addEventListener('click', () => sortTable(index));
  });

  form.addEventListener('submit', (elem) => {
    elem.preventDefault();

    const year = formChilds[3].value.split('-')[0];
    const start = formChilds[4].value;
    const yearNow = new Date().getFullYear();

    Array.from(formChilds).some((elem, index) => {
      if (!elem.value.trim()) {
        notEmpty = false;
        return inputIsNotValid('.error-trim', index);
      }
      else {
        notEmpty = true;
        return inputIsValid('.error-trim', index);
      }
    });

    if (year < 1900 || year > yearNow) {
      dateValid = false;
      inputIsNotValid('.error-date', 3);
    }
    else {
      dateValid = true;
      inputIsValid('.error-date', 3);
    }
    if (start < 2000 || start > yearNow) {
      yearValid = false;
      inputIsNotValid('.error-start', 4);
    }
    else {
      yearValid = true;
      inputIsValid('.error-start', 4);
    }
    if (notEmpty && dateValid && yearValid) {
      addStudent();
    }
  });
});

