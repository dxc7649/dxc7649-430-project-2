const handleCalender = (e) => {
    e.preventDefault();
    
    $("#calenderMessage").animate({width:'hide'},350);
    
    if($("#calenderName").val() == '' || $("#calenderDate").val() == '' || $("#calenderLevel").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#calenderForm").attr("action"), $("#calenderForm").serialize(), function() {
        loadCalendersFromServer();
    });
    
    return false;
};

const handleTest = (e) => {
    e.preventDefault();
    
    sendAjax('GET', '/delete', null, (data) => {
        loadCalendersFromServer();
    });
    
    console.log("success");
};

const testFocus = () => {
    console.log("yes");
};

const CalenderForm = (props) => {
    return (
        <form id="calenderForm"
              onSubmit={handleCalender}
              name="calenderForm"
              action="/maker"
              method="POST"
              className="calenderForm"
        >
            <label htmlFor="activity">Activity: </label>
            <input id="calenderName" type="text" name="activity" placeholder="Activity Name"/>
            <label htmlFor="priorityLevel">Priority: </label>
            <input id="calenderLevel" type="text" name="level" placeholder="Activity Priority" />
            <label htmlFor="date">Date: </label>
            <input id="calenderDate" type="text" name="date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} placeholder="Activity Date"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeCalenderSubmit" type="submit" value="Add Tasks" />
            <input className="makeCalenderSubmit" id="deleteCalenderButton" onClick={handleTest} type="button" calenderid={calender._id} value="Delete Tasks" />
        </form>
    );
};

const CalenderList = function(props) {
    if(props.calenders.length === 0) {
        return (
            <div className="calenderList">
                <h3 className="emptyCalender">No Activities yet</h3>
            </div>
        );
    }
    
    const calenderNodes = props.calenders.map(function(calender) {
        return (
            <div key={calender._id} className="calender">
                <h3 className="calenderName"> Activity: {calender.activity} </h3>
                <h3 className="calenderDate"> Date: {calender.date} </h3>
                <h3 className="calenderLevel"> Level: {calender.priorityLevel} </h3>
            </div> 
        );
    });
    
    return (
        <div className="calenderList">
            {calenderNodes}
        </div>
    );
};

const loadCalendersFromServer = () => {
    sendAjax('GET', '/getCalenders', null, (data) => {
        ReactDOM.render(
            <CalenderList calenders={data.calenders} />, document.querySelector("#calenders")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <CalenderForm csrf={csrf} />, document.querySelector("#makeCalender")
    );
    
    ReactDOM.render(
        <CalenderList calenders={[]} csrf={csrf} />, document.querySelector("#calenders")
    );
    
    loadCalendersFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});