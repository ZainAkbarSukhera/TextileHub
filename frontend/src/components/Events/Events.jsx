import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
      <div>
        {!isLoading && (
            <div className={'styles.section}'}>
              <div className={'${styles.heading}'}>
                <h1>Popular Events</h1>
              </div>

              <div className="w-full grid">
                {allEvents.length !== 0 ? (
                    allEvents.map((event) => (
                        <EventCard key={event._id} data={event} /> // Render each event
                    ))
                ) : (
                    <h4>No Events have!</h4> // Show message if no events
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default Events;