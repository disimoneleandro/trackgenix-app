import React, { useEffect, useState } from 'react';
import styles from './admins.module.css';
import List from './List/index';

const Admins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admins`);
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteAdmin = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admins/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Admin successfully deleted');
      } else {
        alert('Cannot delete the admin');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={styles.container}>
      <h2>Admins</h2>
      <div>
        <List list={admins} setList={setAdmins} deleteAdmin={deleteAdmin} />
      </div>
    </section>
  );
};

export default Admins;
