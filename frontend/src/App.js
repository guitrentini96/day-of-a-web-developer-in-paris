import './App.css';
import React from 'react';
import Modal from './components/Modal';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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
    onlyPriority: false,
    alignment: 'incomplete',
    modal: false,
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
        modal: false,
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
        const value = e.target.value;
        item[value] = !item[value];
        console.log(item);

        // update on the backend
        axios.put(`http://localhost:8000/api/reminders/${item.id}/`, item);
      }
      return item;
    });
    setState({ ...state, reminderList: newReminderList });
  };

  const createItem = () => {
    const item = {
      title: '',
      description: '',
      completed: false,
      id: state.reminderList.length
        ? state.reminderList[state.reminderList.length - 1].id + 1
        : 1,
      created_at: state.today,
      priority: false,
    };
    setState({ ...state, activeItem: item, modal: !state.modal });
  };

  const togglePriority = () => {
    setState({ ...state, onlyPriority: !state.onlyPriority });
  };

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setState({
        ...state,
        alignment: newAlignment,
        viewCompleted: event.target.value === 'complete' ? true : false,
      });
      console.log(newAlignment);
    }
  };

  const renderTabList = () => {
    return (
      <Stack
        direction="row"
        mt={2}
        mb={3}
        justifyContent="space-between"
        minWidth="40rem"
      >
        <ToggleButtonGroup
          exclusive
          value={state.alignment}
          onChange={handleAlignment}
        >
          <ToggleButton value="complete">Complete</ToggleButton>
          <ToggleButton value="incomplete">Incomplete</ToggleButton>
        </ToggleButtonGroup>
        <FormGroup>
          <FormControlLabel
            labelPlacement="top"
            control={
              <Switch
                color="error"
                onChange={togglePriority}
                checked={state.onlyPriority}
              />
            }
            label={<Favorite color="error" />}
          />
        </FormGroup>
      </Stack>
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
    let filteredReminders = state.reminderList.filter(
      (item) => item.completed === state.viewCompleted
    );
    if (state.onlyPriority) {
      filteredReminders = filteredReminders.filter((item) => item.priority);
    }
    return filteredReminders.map((item, i) => (
      <Stack mb={10} key={i} maxWidth="90vw">
        {/* returns the creation date if it's the last item or if the next creation date is different */}
        {i === filteredReminders.length - 1 ||
        filteredReminders[i + 1].created_at !== item.created_at ? (
          item.created_at === state.today ? (
            <Typography variant="h3" component="h2" mb={1}>
              today
            </Typography>
          ) : (
            <h1>{formatDate(item.created_at)}</h1>
          )
        ) : (
          ''
        )}

        <Paper elevation={5} maxWidth="90vw">
          <Stack
            direction="row"
            alignItems="center"
            p={2}
            bgcolor="#946B43"
            width="40rem"
          >
            {/* checkbox that evaluates if a task is completed or not */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.completed}
                  onChange={handleClick}
                  inputProps={{ value: 'completed', name: item.id }}
                  sx={{
                    '&.Mui-checked': {
                      color: 'white',
                    },
                  }}
                />
              }
            />

            {/* Stack that contains the title and the description */}
            <Stack>
              <Typography variant="h4" component="h3" color="white">
                {item.title}
              </Typography>
              <Typography variant="body1" component="p" color="white">
                {item.description}
              </Typography>
              <Typography variant="caption" component="p" color="white">
                {formatDate(item.created_at)}
              </Typography>
            </Stack>

            <FormControlLabel
              sx={{ alignSelf: 'start', marginLeft: 'auto', marginRight: '0' }}
              control={
                <Checkbox
                  checked={item.priority}
                  onChange={handleClick}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite sx={{ color: 'white' }} />}
                  inputProps={{ value: 'priority', name: item.id }}
                />
              }
            />
          </Stack>
        </Paper>
      </Stack>
    ));
  };

  return (
    <Container>
      <Stack mt={2} alignItems="center">
        <Button variant="contained" color="error" onClick={createItem}>
          Add Reminder
        </Button>

        {renderTabList()}

        <Stack spacing={3} direction="column-reverse">
          {renderItems()}
        </Stack>

        {state.modal ? (
          <Modal
            activeItem={state.activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        ) : null}
      </Stack>
      <Stack
        position="fixed"
        left="0"
        bottom="0"
        width="100vw"
        bgcolor="#825831"
        direction="row"
        justifyContent="center"
      >
        <Typography color="white">
          {' '}
          built by{' '}
          <Link
            href="https://github.com/guitrentini96"
            underline="hover"
            target="_blank"
            rel="noopener"
            sx={{ color: 'white' }}
          >
            Guilherme Trentini
          </Link>{' '}
          :)
        </Typography>
      </Stack>
    </Container>
  );
};

export default App;
