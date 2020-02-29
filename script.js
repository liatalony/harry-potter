"use strict";

window.addEventListener("DOMContentLoaded", init);

function init() {
  const prefectClose = document.querySelector(".Prefectclose");
  const prefectBG = document.querySelector(".prefectBG");
  prefectClose.addEventListener("click", function() {
    prefectBG.classList.add("hide");
  });

  fetch("http://petlatkea.dk/2020/hogwarts/families.json")
    .then(res => res.json())
    .then(bloodSplit);
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(split);
}
/* **************GLOBAL VARIABLES*************** */
let filterValue;
let sortValue;
let searchValue;
let whatHouse;
const newArray = [];
let bloodArray = [];
let expelledArray = [];
let currentArray;

document.querySelector("[data-field=filter]").addEventListener("change", halfStart);
document.querySelector("[data-field=sort]").addEventListener("change", halfStart);
document.querySelector(".search").addEventListener("keyup", halfStart);

const OneStudent = {
  firstName: "",
  middleName: undefined,
  lastName: undefined,
  nickName: undefined,
  house: "",
  expelled: false,
  prefect: false,
  inquisuitorial: false,
  img: ""
};
/* ******************************************** */
/* ******************FILTER******************** */
function getFilter() {
  //console.log("hello");
  filterValue = document.querySelector("[data-field=filter]").value;
  //console.log(filterValue);
  if (filterValue === "All") {
    currentArray = currentArray.filter(filterAll);
  } else if (filterValue === "Prefects") {
    currentArray = currentArray.filter(filterPrefects);
  } else if (filterValue === "Expelled") {
    currentArray = expelledArray;
  } else if (filterValue === "Inquisitorial") {
    currentArray = currentArray.filter(isInqios);
  } else {
    currentArray = currentArray.filter(isFilter);
  }
  getSort(currentArray);

  function isFilter(student) {
    if (filterValue != "expelled") {
      return student.house === filterValue;
    }
  }

  function filterAll(student) {
    return true;
  }

  function filterPrefects(student) {
    return student.prefect === true;
  }
  function isInqios(student) {
    return student.inquisuitorial === true;
  }
}
/* ******************************************** */
/* ********************SORT******************** */
function getSort() {
  //console.log("hola");
  sortValue = document.querySelector("[data-field=sort]").value;
  if (sortValue === "First Name") {
    currentArray.sort(first);
  } else if (sortValue === "Last Name") {
    currentArray.sort(last);
  } else if (sortValue === "House") {
    currentArray.sort(sortHouse);
  } else if (sortValue === "Blood") {
    currentArray.sort(sortBlood);
  }
  getSearch(currentArray);
}
function first(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else if (a.firstName > b.firstName) {
    return 1;
  }
  return 0;
}
function last(a, b) {
  if (a.lastName === undefined) {
  }
  if (a.lastName < b.lastName || a.lastName === undefined) {
    return -1;
  } else if (a.lastName > b.lastName || b.lastName === undefined) {
    return 1;
  }
  return 0;
}
function sortHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else if (a.house > b.house) {
    return 1;
  }
  return 0;
}
function sortBlood(a, b) {
  if (a.blood < b.blood) {
    return -1;
  } else if (a.blood > b.blood) {
    return 1;
  }
  return 0;
}
/* ******************************************** */
/* ********************SEARCH******************** */
function getSearch() {
  const input = document.querySelector(".search");
  searchValue = input.value;
  currentArray = currentArray.filter(searching);
  displayList(currentArray);
}

function searching(student) {
  const fullname = [student.firstName, student.middleName, student.nickName, student.lastName].join(" ");
  if (fullname.toLowerCase().indexOf(searchValue) > -1) {
    return true;
  }
}

function displayList(student) {
  document.querySelector("ul").innerHTML = "";
  student.forEach(create);
}

function split(list) {
  //console.log(list);
  list.forEach(makeNewArray);
  halfStart();
}
function bloodSplit(bloods) {
  bloodArray = bloods;
  console.log(bloodArray);
}

function halfStart() {
  currentArray = newArray;
  getFilter(currentArray);
}
/* **************** FIX BAD ARRAY **************** */
function makeNewArray(badStudent) {
  const oneStudent = Object.create(OneStudent);

  badStudent.fullname = badStudent.fullname.trim();

  //---------------First Name-----------------//
  if (badStudent.fullname.indexOf(" ") > -1) {
    oneStudent.firstName = badStudent.fullname.substring(0, badStudent.fullname.indexOf(" "));
  } else {
    oneStudent.firstName = badStudent.fullname;
  }
  oneStudent.firstName = oneStudent.firstName.charAt(0).toUpperCase() + oneStudent.firstName.substring(1).toLowerCase();

  //-------------Last Name----------------//
  if (badStudent.fullname.indexOf(" ") > -1) {
    oneStudent.lastName = badStudent.fullname.substring(badStudent.fullname.lastIndexOf(" ") + 1);
    oneStudent.lastName = oneStudent.lastName.charAt(0).toUpperCase() + oneStudent.lastName.substring(1).toLowerCase();

    oneStudent.img = `${oneStudent.lastName.toLowerCase()}_${oneStudent.firstName.charAt(0).toLowerCase()}`;
    //console.log(oneStudent.img);
    //console.log(oneStudent.firstName + " " + oneStudent.lastName);
  }

  //-------------Middle Name-----------------//
  if (badStudent.fullname.indexOf(" ") != badStudent.fullname.lastIndexOf(" ")) {
    if (badStudent.fullname.indexOf(`"`) > -1) {
      //------Nick Name-----------------//
      oneStudent.nickName = badStudent.fullname.substring(badStudent.fullname.indexOf(`"`), badStudent.fullname.lastIndexOf(`"`) + 1);
      oneStudent.nickName = oneStudent.nickName.charAt(0) + oneStudent.nickName.charAt(1).toUpperCase() + oneStudent.nickName.substring(2).toLowerCase();
      //console.log(oneStudent.nickName);
    } else {
      oneStudent.middleName = badStudent.fullname.substring(badStudent.fullname.indexOf(" ") + 1, badStudent.fullname.lastIndexOf(" "));
      oneStudent.middleName = oneStudent.middleName.charAt(0).toUpperCase() + oneStudent.middleName.substring(1).toLowerCase();
      //console.log(oneStudent.middleName);
    }
  }
  badStudent.house = badStudent.house.trim();
  oneStudent.house = badStudent.house;
  oneStudent.house = oneStudent.house.charAt(0).toUpperCase() + oneStudent.house.substring(1).toLowerCase();
  //console.log(oneStudent.house);
  oneStudent.prefect = false;
  oneStudent.inquisuitorial = false;
  oneStudent.expelled = false;

  //-------------BLOOD -----------------//

  const pureArray = bloodArray.pure.filter(blood => oneStudent.lastName === blood);
  if (pureArray.length > 0) {
    const pureAndHalf = bloodArray.half.filter(blood => oneStudent.lastName === blood);
    if (pureAndHalf.length > 0) {
      oneStudent.blood = "Half-blood";
    } else {
      oneStudent.blood = "Pure-blood";
    }
  } else {
    const halfArray = bloodArray.half.filter(blood => oneStudent.lastName === blood);
    if (halfArray.length > 0) {
      oneStudent.blood = "Half-blood";
    } else {
      oneStudent.blood = "Muggle-born";
    }
  }

  newArray.push(oneStudent);
}
/* ************************************************************ */

function create(name) {
  const template = document.querySelector("template").content;
  const templateCopy = template.cloneNode(true);
  const studentName = templateCopy.querySelector(".name");

  studentName.textContent = [name.firstName, name.middleName, name.nickName, name.lastName].join(" ");

  /* ************************* MODAL *************************** */
  studentName.addEventListener("click", function() {
    const bg = document.querySelector(".BG");
    bg.classList.remove("hide");
    const modalName = document.querySelector("h2");
    const house = document.querySelector("h4");
    const modal = document.querySelector(".modal");
    const crest = document.querySelector(".crest");
    const picture = document.querySelector(".profile");
    const bloodType = document.querySelector(".blood span");
    const club = document.querySelector(".inquisitorial");
    const expel = document.querySelector(".expel");
    const makeRevoke = document.querySelector(".makeRevoke");
    let imgPath;

    if (name.prefect) {
      document.querySelector(".makeRevoke").textContent = "Revoke Prefect";
    } else {
      document.querySelector(".makeRevoke").textContent = "Make Prefect";
    }
    if (name.expelled) {
      expel.textContent = "Expelled";
      expel.disabled = true;
      makeRevoke.classList.add("hide");
      club.classList.add("hide");
      modal.classList.add("Expelled");
    } else {
      expel.textContent = "Expel";
      expel.disabled = false;
      makeRevoke.classList.remove("hide");
      club.classList.remove("hide");
    }

    const checkName = newArray.filter(imgName);
    modalName.textContent = studentName.textContent;
    house.textContent = name.house;
    crest.setAttribute("src", `images/${name.house}.png`);
    bloodType.textContent = name.blood;
    if (name.blood === "Pure-blood" || name.house === "Slytherin") {
      club.classList.remove("hide");
      if (name.inquisuitorial) {
        club.textContent = "Remove from inquisitorial club";
      } else {
        club.textContent = "Add to inquisitorial club";
      }
    } else {
      club.classList.add("hide");
    }

    if (checkName.length > 1) {
      imgPath = `${name.lastName.toLowerCase()}_${name.firstName.toLowerCase()}`;
    } else {
      imgPath = `${name.img}`;
    }

    function imgName(other) {
      return name.lastName === other.lastName;
    }

    picture.setAttribute("src", `images/images/${imgPath}.png`);
    whatHouse = name.house;
    modal.classList.add(whatHouse);

    makeRevoke.addEventListener("click", ThePrefect);
    club.addEventListener("click", inquis);
    expel.addEventListener("click", expelling);
    document.querySelector(".Modalclose").addEventListener("click", function() {
      document.querySelector(".BG").classList.add("hide");
      document.querySelector(".modal").classList.remove(whatHouse);
      // Had to google that one. without this the eventListener is active for all students.
      // Each time i click on a student the event is activated on every previously clicked student.
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
      makeRevoke.removeEventListener("click", ThePrefect);
      club.removeEventListener("click", inquis);
      expel.removeEventListener("click", expelling);
      modal.classList.remove(`Expelled`);
    });

    function ThePrefect() {
      if (name.prefect) {
        console.log("prefect is now revoked");
        name.prefect = false;
        document.querySelector(".makeRevoke").textContent = "Make Prefect";
        halfStart();
      } else {
        const checkPRE = newArray.filter(student => student.prefect);
        const checkHouse = checkPRE.filter(prefect => prefect.house == name.house);
        if (checkHouse.length < 2) {
          console.log(`${name.firstName} is now a prefect`);
          name.prefect = true;
          document.querySelector(".makeRevoke").textContent = "Revoke Prefect";
          halfStart();
          console.log(checkHouse);
        } else {
          document.querySelector(".prefectBG").classList.remove("hide");
          document.querySelector(".prefect1").textContent = [checkHouse[0].firstName, checkHouse[0].middleName, checkHouse[0].nickName, checkHouse[0].lastName].join(" ");
          document.querySelector(".prefect2").textContent = [checkHouse[1].firstName, checkHouse[1].middleName, checkHouse[1].nickName, checkHouse[1].lastName].join(" ");
          document.querySelector(".remove1").addEventListener("click", function() {
            checkHouse[0].prefect = false;
            name.prefect = true;
            document.querySelector(".makeRevoke").textContent = "Revoke Prefect";
            document.querySelector(".prefectBG").classList.add("hide");
          });
          document.querySelector(".remove2").addEventListener("click", function() {
            checkHouse[1].prefect = false;
            name.prefect = true;
            document.querySelector(".prefectBG").classList.add("hide");
            document.querySelector(".makeRevoke").textContent = "Revoke Prefect";
          });
        }
        // console.log(name.firstName + " " + name.prefect);
      }
    }

    function inquis() {
      if (name.inquisuitorial) {
        name.inquisuitorial = false;
        club.textContent = "Add to inquisitorial club";
      } else {
        name.inquisuitorial = true;
        club.textContent = "Remove from inquisitorial club";
      }
      console.log(`${name.firstName} is ${name.inquisuitorial}`);

      halfStart();
    }

    function expelling() {
      name.expelled = true;
      const index = newArray.indexOf(name);
      newArray.splice(index, 1);
      expelledArray.push(name);
      modal.classList.add(`Expelled`);
      name.prefect = false;
      makeRevoke.classList.add("hide");
      name.inquisuitorial = false;
      club.classList.add("hide");
      expel.textContent = "Expelled";
      expel.disabled = true;
      halfStart();
    }
  });
  document.querySelector("ul").appendChild(templateCopy);
}
