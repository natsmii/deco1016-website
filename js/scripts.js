//progress bar number from 0 to 3
var currentSectionIndex = 0;
//for the logoin screen, swtich the screen
function initLoginPage() {
  var signUpButton = document.getElementById("signUp");
  var signInButton = document.getElementById("signIn");
  var signUpButtonMob = document.getElementById("signUpMob");
  var signInButtonMob = document.getElementById("signInMob");

  var container = document.getElementById("container");

  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  signUpButtonMob.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButtonMob.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });
  console.log("initLoginPage");
}
//for the mobile menu open
function toggleDrawerMenu() {
  var x = document.getElementById("menu");
  if (x.className === "menu") {
    x.className += " menu-open";
  } else {
    x.className = "menu";
  }
}
//for the mobile menu close
function closeDrawerMenu() {
  var x = document.getElementById("menu");
  if (x) {
    if (x.className != "menu") {
      x.className = "menu";
    }
  }
}
//navigating the pages in the site
function loadPage(page) {
  if (event) {
    event.preventDefault();
  }
  closeDrawerMenu();
  var rnd = getRandom(1000, 9999);
  fetch(page + ".html?rnd=" + rnd)
    .then(response => response.text())
    .then(html => {
      var pageData = extractContent(html);
      document.getElementById("main").innerHTML = pageData;
      var scripts = Array.prototype.slice.call(
        document.getElementById("main").getElementsByTagName("script")
      );
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src != "") {
          var tag = document.createElement("script");
          tag.src = scripts[i].src;
          document.getElementsByTagName("head")[0].appendChild(tag);
        } else {
          eval(scripts[i].innerHTML);
        }
      }
    })
    .catch(error => {
      console.warn(error);
    });
}
//getting the html file content
function extractContent(html) {
  var mainDoc = new DOMParser()
    .parseFromString(html, "text/html")
    .getElementById("main").innerHTML;
  return mainDoc;
}

//the back button in the booking section
function backStep(step) {
  event.preventDefault();
  var lSteps = document.getElementById("steps").getElementsByTagName("div");
  var lSections = document
    .querySelector(".form-wrapper")
    .getElementsByTagName("fieldset");
  lSteps[currentSectionIndex].classList.remove("done");
  lSteps[currentSectionIndex].classList.remove("active");
  lSections[currentSectionIndex].classList.remove("is-active");
  lSections[step].classList.add("is-active");
  lSteps[step].classList.remove("done");
  lSteps[step].classList.add("active");
  currentSectionIndex = step;
}

//use API to send email
function emailApi(toEmail, subject, messageText) {
  var data = new FormData();
  data.append("from", "xxxnatsmii@gmail.com");
  data.append("fromName", "My Health");
  data.append("subject", subject);
  data.append("to", toEmail);
  data.append("bodyText", messageText);
  data.append("apikey", "8509b1f7-bafa-4e55-ae50-8e40060c51ee");
  data.append("isTransactional", true);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.elasticemail.com/v2/email/send", true);
  xhr.onload = function() {
    console.log(this.responseText);
  };
  xhr.send(data);
}
//the next button trigger the function
function nextStep(step) {
  event.preventDefault();
  var current_user = localStorage.getItem("current_user");
  if (!current_user) {
    showModule("Please login or create an account first!");
    return;
  } //control the form data
  if (step == 0) {
    var obj = [
      {
        fieldName: "cardnumber",
        Min: 16,
        Message: "Please enter your card number"
      },
      { fieldName: "expiredate", Min: 5, Message: "Please enter a vail date " },
      {
        fieldName: "cardholder_name",
        Min: 2,
        Message: "please enter cardholder name"
      },
      { fieldName: "cvv", Min: 3, Max: 4, Message: "Please enter cvv number" }
    ];

    if (checkField(obj)) {
      var name = localStorage.getItem(current_user + "_name");
      document.querySelector("#payment_name").innerText = name;
      localStorage.setItem("current_user", "");
      //call the function to send email
      emailApi(
        current_user,
        "Order Confirmation",
        "Hi " + name + "\r\n" + "You have successfully created an account !"
      );
    } else {
      return;
    }
  } //check the form data
  if (step == 2) {
    resetInputError("gender");
    var obj = [
      {
        fieldName: "first_name",
        Min: 2,
        Message: "Please enter your first name"
      },
      {
        fieldName: "last_name",
        Min: 2,
        Message: "Please enter your last name"
      },
      {
        fieldName: "datepicker",
        Min: 10,
        Message: "Please choose your appointment time"
      },
      { fieldName: "age", Min: 1, Max: 3, Message: "Please enter your age" }
    ];

    if (checkField(obj)) {
      var fname = document.querySelector('input[name="first_name"]').value;
      var lname = document.querySelector('input[name="last_name"]').value;
      var genders = document.querySelector('input[name="gender"]:checked');
      if (!genders) {
        markInputError("gender", "Please choose your gender");
        return;
      }
      localStorage.setItem(current_user + "_name", fname + " " + lname);
    } else {
      return;
    }
  } // moving to the next step for the booking
  var lSteps = document.getElementById("steps").getElementsByTagName("div");
  var lSections = document
    .querySelector(".form-wrapper")
    .getElementsByTagName("fieldset");
  lSteps[currentSectionIndex].classList.remove("active");
  lSteps[currentSectionIndex].classList.add("done");
  lSections[currentSectionIndex].classList.remove("is-active");

  if (step > 0) {
    lSections[step].classList.add("is-active");
    lSteps[step].classList.add("active");
    currentSectionIndex = step;
  } else {
    lSections[currentSectionIndex + 1].classList.add("is-active");
    currentSectionIndex = 0;
  }
}
//produce random number
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
//this function check the form field
function checkField(fields) {
  var failed = false;
  for (i = 0; i < fields.length; i++) {
    row = fields[i];
    var fieldName = row["fieldName"];
    var Min = row["Min"];
    var Max = row["Max"];
    var Message = row["Message"];
    var Type = row["Type"];
    var lField = document.querySelector('input[name="' + fieldName + '"]');
    lField.classList.remove("has-error");
    resetInputError(fieldName);
    var isValid = true;
    if (Min) {
      if (lField.value.length < Min) {
        isValid = false;
      }
    }
    if (Max) {
      if (lField.value.length > Max) {
        isValid = false;
      }
    }
    if (Type == "email") {
      var Regex = /\S+@\S+\.\S+/;
      if (!Regex.test(lField.value)) {
        isValid = false;
      }
    }
    if (!isValid) {
      lField.classList.add("has-error");
      if (Message) {
        markInputError(fieldName, Message);
      }
      console.log(fieldName + " hass error");
      failed = true;
    }
  }
  if (failed) {
    return false;
  } else {
    return true;
  }
}
//use this function to show the error under the form field
function markInputError(fieldName, Message) {
  document.querySelector("#error_" + fieldName).innerText = Message;
}
//clear the error
function resetInputError(fieldName) {
  document.querySelector("#error_" + fieldName).innerText = "";
}
//for signup form
function signUp() {
  event.preventDefault();
  resetInputError("terms");
  var obj = [
    {
      fieldName: "email",
      Type: "email",
      Message: "please enter a valid email address"
    },
    {
      fieldName: "password",
      Min: 6,
      Message: "password mush be 6 characters or more"
    },
    {
      fieldName: "password2",
      Min: 6,
      Message: "password mush be 6 characters or more"
    }
  ];
  if (checkField(obj)) {
    var email = document.querySelector('input[name="email"]').value;
    var pass = document.querySelector('input[name="password"]').value;
    var pass2 = document.querySelector('input[name="password2"]').value;
    if (document.querySelector("#terms").checked == false) {
      markInputError("terms", "Your must accept terms and conditions!");
      return;
    }
    if (pass == pass2) {
      localStorage.setItem(email, pass);
      localStorage.setItem("current_user", email);
      loadPage("booking");
    } else {
      markInputError(
        "password2",
        "Your password and confirmation password do not match"
      );
    }
  }
}
// for login form
function signIn() {
  event.preventDefault();
  var obj = [
    {
      fieldName: "email-account",
      Type: "email",
      Message: "please enter a valid email address"
    },
    {
      fieldName: "password-account",
      Min: 6,
      Message: "password mush be 6 characters or more"
    }
  ];
  if (checkField(obj)) {
    var email = document.querySelector('input[name="email-account"]').value;
    var pass = document.querySelector('input[name="password-account"]').value;
    var StroragePass = localStorage.getItem(email);
    if (pass == StroragePass) {
      localStorage.setItem("current_user", email);
      loadPage("booking");
    } else {
      showModule("Login field, email or password is wrong!");
      return;
    }
  }
}
//navigate to homepage
function goHome() {
  event.preventDefault();
  window.location.href = "index.html";
}
//show the modal message
function showModule(Message, Title) {
  if (Message) {
    document
      .getElementById("mini-modal")
      .querySelector(".modal-message").innerHTML = Message;
  }
  if (Title) {
    document
      .getElementById("mini-modal")
      .querySelector(".modal-title").innerHTML = Title;
  }

  document.getElementById("mini-modal").classList.add("open");
}

function closeModal() {
  var modal = document.querySelector('[class="modal open"]');
  modal.classList.remove("open");
}
//when click out of the modal window will close it
document.addEventListener(
  "click",
  function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    // Close modal window with 'data-dismiss' attribute or when the backdrop is
    // clicked
    if (
      (target.hasAttribute("data-dismiss") &&
        target.getAttribute("data-dismiss") == "modal") ||
      target.classList.contains("modal")
    ) {
      closeModal();
      e.preventDefault();
    }
  },
  false
);
//the animation for the landing page
var Animation = function({ offset } = { offset: 10 }) {
  var _elements;

  var windowTop = (offset * window.innerHeight) / 100;
  var windowBottom = window.innerHeight - windowTop;
  var windowLeft = 0;
  var windowRight = window.innerWidth;
  //the start of aniamtion
  function start(element) {
    element.style.animationDelay = element.dataset.animationDelay;
    element.style.animationDuration = element.dataset.animationDuration;
    element.classList.add(element.dataset.animation);
    element.dataset.animated = "true";
  }
  // detecting elements if it is show on the screen when scrolling
  function isElementOnScreen(element) {
    var elementRect = element.getBoundingClientRect();
    var elementTop =
      elementRect.top + parseInt(element.dataset.animationOffset) ||
      elementRect.top;
    var elementBottom =
      elementRect.bottom - parseInt(element.dataset.animationOffset) ||
      elementRect.bottom;
    var elementLeft = elementRect.left;
    var elementRight = elementRect.right;

    return (
      elementTop <= windowBottom &&
      elementBottom >= windowTop &&
      elementLeft <= windowRight &&
      elementRight >= windowLeft
    );
  }
  //check elements one by one ,check mutiple elements
  function checkElementsOnScreen(els = _elements) {
    if (!els) {
      return;
    }
    for (var i = 0, len = els.length; i < len; i++) {
      if (els[i].dataset.animated) continue;

      isElementOnScreen(els[i]) && start(els[i]);
    }
  }

  function update() {
    _elements = document.querySelectorAll(
      "[data-animation]:not([data-animated])"
    );
    checkElementsOnScreen(_elements);
  }

  window.addEventListener("load", update, false);
  window.addEventListener("scroll", () => checkElementsOnScreen(_elements), {
    passive: true
  });
  window.addEventListener(
    "resize",
    () => checkElementsOnScreen(_elements),
    false
  );

  return {
    start,
    isElementOnScreen,
    update
  };
};

// Initialize
var options = {
  offset: 20 // percentage of window
};
var animation = new Animation(options);
