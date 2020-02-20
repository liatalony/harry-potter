window.addEventListener("DOMContentLoaded", init);

function init() {
  const bg = document.querySelector(".BG");
  const modal = document.querySelector(".modal");
  bg.addEventListener("click", function() {
    bg.classList.add("hide");
    modal.classList.remove(whatHouse);
  });
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(split);
}

const newArray = [];

function split(list) {
  //console.log(list);
  list.forEach(makeNewArray);
  newArray.forEach(create);
}

function makeNewArray(badStudent) {
  const oneStudent = {
    firstName: "",
    middleName: undefined,
    lastName: undefined,
    nickName: undefined,
    house: ""
  };
  badStudent.fullname = badStudent.fullname.trim();
  //---------------First Name-----------------//
  if (badStudent.fullname.indexOf(" ") > 0) {
    oneStudent.firstName = badStudent.fullname.substring(0, badStudent.fullname.indexOf(" "));
  } else {
    oneStudent.firstName = badStudent.fullname;
  }
  oneStudent.firstName = oneStudent.firstName.charAt(0).toUpperCase() + oneStudent.firstName.substring(1).toLowerCase();

  //-------------Last Name----------------//
  if (badStudent.fullname.indexOf(" ") > 0) {
    oneStudent.lastName = badStudent.fullname.substring(badStudent.fullname.lastIndexOf(" ") + 1);
    oneStudent.lastName = oneStudent.lastName.charAt(0).toUpperCase() + oneStudent.lastName.substring(1).toLowerCase();

    //console.log(oneStudent.firstName + " " + oneStudent.lastName);
  }

  //-------------Middle Name-----------------//
  if (badStudent.fullname.indexOf(" ") != badStudent.fullname.lastIndexOf(" ")) {
    if (badStudent.fullname.indexOf(`"`) > 0) {
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

  newArray.push(oneStudent);
}

let whatHouse;
function create(name) {
  console.log(name);
  const template = document.querySelector("template").content;
  const templateCopy = template.cloneNode(true);
  const studentName = templateCopy.querySelector(".name");
  if (name.middleName) {
    if (name.nickName) {
      if (name.lastName) {
        studentName.textContent = `${name.firstName} ${name.middleName} ${name.nickName} ${name.lastName}`;
      } else {
        studentName.textContent = `${name.firstName} ${name.middleName} ${name.nickName}`;
      }
    } else if (name.lastName) {
      studentName.textContent = `${name.firstName} ${name.middleName} ${name.lastName}`;
    } else {
      studentName.textContent = `${name.firstName} ${name.middleName}`;
    }
  } else if (name.nickName) {
    if (name.lastName) {
      studentName.textContent = `${name.firstName} ${name.nickName} ${name.lastName}`;
    } else {
      studentName.textContent = `${name.firstName} ${name.nickName}`;
    }
  } else if (name.lastName) {
    studentName.textContent = `${name.firstName} ${name.lastName}`;
  } else {
    studentName.textContent = `${name.firstName}`;
  }

  templateCopy.querySelector(".name").addEventListener("click", function() {
    const bg = document.querySelector(".BG");
    bg.classList.remove("hide");
    const modalName = document.querySelector("h2");
    const house = document.querySelector("h3");
    const modal = document.querySelector(".modal");
    const crest = document.querySelector(".crest");

    modalName.textContent = studentName.textContent;
    house.textContent = name.house;
    crest.setAttribute("src", `images/${name.house}.png`);

    whatHouse = name.house;
    modal.classList.add(whatHouse);
    console.log(whatHouse);
  });

  document.querySelector("ul").appendChild(templateCopy);
}
