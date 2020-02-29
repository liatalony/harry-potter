"use strict";

window.addEventListener("DOMContentLoaded", init);

function init() {
  const bg = document.querySelector(".BG");
  const modal = document.querySelector(".modal");
  document.querySelector(".Modalclose").addEventListener("click", function() {
    bg.classList.add("hide");
    modal.classList.remove(whatHouse);
  });

  const prefectClose = document.querySelector(".Prefectclose");
  const prefectBG = document.querySelector(".prefectBG");
  prefectClose.addEventListener("click", function() {
    prefectBG.classList.add("hide");
  });

  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(split);
}
/* **************GLOBAL VARIABLES*************** */
let filterValue;
let sortValue;
const newArray = [];
let currentArray;

document.querySelector("[data-field=filter]").addEventListener("change", halfStart);
document.querySelector("[data-field=sort]").addEventListener("change", halfStart);

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
    getSort(currentArray);
  } else {
    currentArray = currentArray.filter(isFilter);
    getSort(currentArray);
  }

  function isFilter(student) {
    if (filterValue != "expelled") {
      return student.house === filterValue;
    }
  }

  function filterAll(student) {
    return true;
  }
}
/* ******************************************** */

/* ********************SORT******************** */
function getSort() {
  //console.log("hola");
  sortValue = document.querySelector("[data-field=sort]").value;
  if (sortValue === "First Name") {
    currentArray.sort(first);
    displayList(currentArray);
  } else if (sortValue === "Last Name") {
    currentArray.sort(last);
    displayList(currentArray);
  } else if (sortValue === "House") {
    currentArray.sort(sortHouse);
    displayList(currentArray);
  }
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
/* ******************************************** */

function displayList(student) {
  document.querySelector("ul").innerHTML = "";
  student.forEach(create);
}

function split(list) {
  //console.log(list);
  list.forEach(makeNewArray);
  halfStart();
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

  newArray.push(oneStudent);
}
/* ************************************************************ */

let whatHouse;
function create(name) {
  //console.log(name);

  const template = document.querySelector("template").content;
  const templateCopy = template.cloneNode(true);
  const studentName = templateCopy.querySelector(".name");

  studentName.textContent = [name.firstName, name.middleName, name.nickName, name.lastName].join(" ");
  studentName.addEventListener("click", function() {
    /* ************************* MODAL *************************** */

    if (name.prefect) {
      document.querySelector(".makeRevoke").textContent = "Revoke Prefect";
    } else {
      document.querySelector(".makeRevoke").textContent = "Make Prefect";
    }

    const bg = document.querySelector(".BG");
    bg.classList.remove("hide");
    const modalName = document.querySelector("h2");
    const house = document.querySelector("h4");
    const modal = document.querySelector(".modal");
    const crest = document.querySelector(".crest");
    const picture = document.querySelector(".profile");
    const makeRevoke = document.querySelector(".makeRevoke");
    let imgPath;
    const checkName = newArray.filter(imgName);
    modalName.textContent = studentName.textContent;
    house.textContent = name.house;
    crest.setAttribute("src", `images/${name.house}.png`);
    if (checkName.length > 1) {
      imgPath = `${name.lastName.toLowerCase()}_${name.firstName.toLowerCase()}`;
    } else {
      imgPath = `${name.img}`;
    }

    function imgName(other) {
      return name.lastName === other.lastName;
    }

    picture.setAttribute("src", `images/images/${imgPath}.png`);
    //console.log(`images/images/${imgPath}.png`);
    whatHouse = name.house;
    modal.classList.add(whatHouse);

    makeRevoke.addEventListener("click", ThePrefect);

    function ThePrefect() {
      if (name.prefect) {
        console.log("prefect is now revoked");
        name.prefect = false;
        document.querySelector(".BG").classList.add("hide");
        document.querySelector(".modal").classList.remove(whatHouse);

        // Had to google that one. without this the eventListener is active for all students.
        // Each time i click on a student the event is activated on every previously clicked student.
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
        makeRevoke.removeEventListener("click", ThePrefect);
        halfStart();
      } else {
        console.log("prefect is ");
        const checkPRE = newArray.filter(student => student.prefect);
        const checkHouse = checkPRE.filter(prefect => prefect.house == name.house);
        console.log(checkHouse);
        if (checkHouse.length < 2) {
          name.prefect = true;
          document.querySelector(".BG").classList.add("hide");
          document.querySelector(".modal").classList.remove(whatHouse);
          makeRevoke.removeEventListener("click", ThePrefect);
          halfStart();
        } else {
          document.querySelector(".prefectBG").classList.remove("hide");
        }
        console.log(name.firstName + " " + name.prefect);
      }
    }
  });

  document.querySelector("ul").appendChild(templateCopy);
}
