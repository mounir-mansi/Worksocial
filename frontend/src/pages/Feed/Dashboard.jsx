import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./Dashboard.css";
import UserBar from "../../components/UserBar/UserBar";
import EventMiniCard from "../../components/Events/EventMiniCard";
import { useEvent } from "../../contexts/EventContext";

export default function Dashboard() {
  const [value, setValue] = useState(new Date());
  const onChange = () => {
    setValue(value);
  };

  const { events, getEvents } = useEvent();
  const sortedEvents = events.sort((a, b) =>
    a.StartDate > b.StartDate ? 1 : -1
  );
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.StartDate) >= new Date()
  );

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className="container">
      <UserBar />
      <div className="content-area">
        <div>
          <h4>Événements à venir</h4>
          <hr />
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => {
              // Calculate the number of milliseconds between the event start date and current date
              const timeDiff =
                new Date(event.StartDate).getTime() - new Date().getTime();

              // Calculate the number of days remaining
              const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

              return (
                <div className="event-card" key={event.Event_ID}>
                  <EventMiniCard event={event} daysRemaining={daysRemaining} />
                </div>
              );
            })
          ) : (
            <p>Aucun événement à venir</p>
          )}
        </div>
      </div>
      <div className="sidebar">
        <div className="sidebar-item">
          <Calendar onChange={onChange} value={value} />
        </div>
      </div>
    </div>
  );
}
