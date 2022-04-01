import './App.css';
import React from 'react';
import Modal from './components/Modal';
import axios from 'axios';

const App = () => {
  const [state, setState] = React.useState({
    viewCompleted: false,
    activeItem: {
      title: '',
      description: '',
      completed: false,
      created_at: '',
    },
    reminderList: [],
    today: '',
  });

  React.useEffect(() => {
    const today = new Date();
    const fetchReminders = async () => {
      const res = await fetch('http://localhost:8000/api/reminders/');
      const returnedList = await res.json();
      const reminderList = returnedList.map((reminder) => {
        const reminderDate = reminder.created_at.split('-').map((item) => {
          return parseInt(item);
        });
        const newDate = new Date(reminderDate);
        reminder.created_at = newDate.toDateString();
        return reminder;
      });
      setState({
        ...state,
        reminderList: reminderList,
        today: today.toDateString(),
      });
    };

    fetchReminders().catch(console.error);
  }, []);

  const toggle = () => {
    setState({ ...state, modal: !state.modal });
  };

  const handleSubmit = (item) => {
    axios.post('http://localhost:8000/api/reminders/', item);
    const newReminderList = state.reminderList.concat(item);
    setState({ ...state, reminderList: newReminderList, modal: false });
  };

  const handleClick = (e) => {
    const newReminderList = state.reminderList.map((item) => {
      if (item.id === parseInt(e.target.name)) {
        item.completed = !item.completed;
        console.log(item);

        // update on the backend
        axios.put(`http://localhost:8000/api/reminders/${item.id}/`, item);
      }
      return item;
    });
    setState({ ...state, reminderList: newReminderList });
  };

  const createItem = () => {
    const dateToday = new Date();
    const item = {
      title: '',
      description: '',
      completed: false,
      id: state.reminderList[state.reminderList.length - 1].id + 1,
      created_at: dateToday.toDateString(),
    };
    setState({ ...state, activeItem: item, modal: !state.modal });
  };

  const displayCompleted = (status) => {
    if (status) {
      return setState({ ...state, viewCompleted: true });
    }
    return setState({ ...state, viewCompleted: false });
  };

  const renderTabList = () => {
    return (
      <div className="switch-buttons">
        <button
          onClick={() => displayCompleted(true)}
          className={state.viewCompleted ? 'active' : ''}
        >
          Complete
        </button>
        <button
          onClick={() => displayCompleted(false)}
          className={state.viewCompleted ? '' : 'active'}
        >
          Incomplete
        </button>
      </div>
    );
  };

  const formatDate = (date) => {
    const fullDate = new Date(date);
    const days_of_the_week = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    return `${days_of_the_week[fullDate.getDay()]}. ${
      months[fullDate.getMonth()]
    } ${fullDate.getDate()}.`;
  };

  const renderItems = () => {
    const filteredReminders = state.reminderList.filter(
      (item) => item.completed === state.viewCompleted
    );
    return filteredReminders.map((item, i) => (
      <>
        <li key={item.id} className="general-list-item">
          {/* returns the creation date if it's the last item or if the next creation date is different */}
          {i === filteredReminders.length - 1 ||
          filteredReminders[i + 1].created_at !== item.created_at ? (
            item.created_at === state.today ? (
              <h1>today</h1>
            ) : (
              <h1>{formatDate(item.created_at)}</h1>
            )
          ) : (
            ''
          )}

          <div className="list-item">
            <input
              type="checkbox"
              checked={item.completed}
              className="status-checkbox"
              onChange={handleClick}
              name={item.id}
            ></input>
            <div className="title-description">
              <h1
                className={`title ${
                  state.viewCompleted ? 'completed-reminder' : ''
                }`}
                title={item.description}
              >
                {item.title}
              </h1>
              <span className="description">{item.description}</span>
              {/* <span className="description">{formatDate(item.created_at)}</span> */}
            </div>
          </div>
        </li>
      </>
    ));
  };

  return (
    <div className="page-box">
      <div className="">
        <button onClick={createItem} className="btn btn-success">
          Add Task
        </button>
      </div>

      {renderTabList()}

      <ul className="list">{renderItems()}</ul>

      {state.modal ? (
        <Modal
          activeItem={state.activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </div>
  );
};

export default App;
