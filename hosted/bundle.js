"use strict";

var handleCalender = function handleCalender(e) {
  e.preventDefault();
  $("#calenderMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#calenderName").val() == '' || $("#calenderDate").val() == '' || $("#calenderLevel").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#calenderForm").attr("action"), $("#calenderForm").serialize(), function () {
    loadCalendersFromServer();
  });
  return false;
};

var handleTest = function handleTest(e) {
  e.preventDefault();
  sendAjax('GET', '/delete', null, function (data) {
    loadCalendersFromServer();
  });
  console.log("success");
};

var testFocus = function testFocus() {
  console.log("yes");
};

var CalenderForm = function CalenderForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "calenderForm",
      onSubmit: handleCalender,
      name: "calenderForm",
      action: "/maker",
      method: "POST",
      className: "calenderForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "activity"
    }, "Activity: "), /*#__PURE__*/React.createElement("input", {
      id: "calenderName",
      type: "text",
      name: "activity",
      placeholder: "Activity Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "priorityLevel"
    }, "Priority: "), /*#__PURE__*/React.createElement("input", {
      id: "calenderLevel",
      type: "text",
      name: "level",
      placeholder: "Activity Priority"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "date"
    }, "Date: "), /*#__PURE__*/React.createElement("input", {
      id: "calenderDate",
      type: "text",
      name: "date",
      onFocus: function onFocus(e) {
        return e.target.type = 'date';
      },
      onBlur: function onBlur(e) {
        return e.target.type = 'text';
      },
      placeholder: "Activity Date"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeCalenderSubmit",
      type: "submit",
      value: "Add Tasks"
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeCalenderSubmit",
      id: "deleteCalenderButton",
      onClick: handleTest,
      type: "button",
      calenderid: calender._id,
      value: "Delete Tasks"
    }))
  );
};

var CalenderList = function CalenderList(props) {
  if (props.calenders.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "calenderList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyCalender"
      }, "No Activities yet"))
    );
  }

  var calenderNodes = props.calenders.map(function (calender) {
    return (/*#__PURE__*/React.createElement("div", {
        key: calender._id,
        className: "calender"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "calenderName"
      }, " Activity: ", calender.activity, " "), /*#__PURE__*/React.createElement("h3", {
        className: "calenderDate"
      }, " Date: ", calender.date, " "), /*#__PURE__*/React.createElement("h3", {
        className: "calenderLevel"
      }, " Level: ", calender.priorityLevel, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "calenderList"
    }, calenderNodes)
  );
};

var loadCalendersFromServer = function loadCalendersFromServer() {
  sendAjax('GET', '/getCalenders', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CalenderList, {
      calenders: data.calenders
    }), document.querySelector("#calenders"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(CalenderForm, {
    csrf: csrf
  }), document.querySelector("#makeCalender"));
  ReactDOM.render( /*#__PURE__*/React.createElement(CalenderList, {
    calenders: [],
    csrf: csrf
  }), document.querySelector("#calenders"));
  loadCalendersFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#calenderMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#calenderMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
