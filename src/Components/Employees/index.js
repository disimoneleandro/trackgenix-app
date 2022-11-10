import { useEffect, useState } from 'react';
import styles from './employees.module.css';
import Modal from '../Shared/Modal';
import Spinner from '../Shared/Spinner';
import Table from '../Shared/Table';

function Employees() {
  const [employees, saveEmployees] = useState([]);

  const [modalDisplay, setModalDisplay] = useState('');
  const [children, setChildren] = useState('');
  const [isToConfirm, setIsToConfirm] = useState(false);
  const [id, setId] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/employees`);
      const data = await response.json();
      if (response.ok) {
        saveEmployees(data.data);
      } else {
        saveEmployees([]);
      }
      setFetching(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/employees/${id}`, {
        method: 'DELETE'
      });
      const newEmployees = employees.filter((employee) => employee._id !== id);
      saveEmployees(newEmployees);
      if (!response.ok) {
        setChildren('Cannot delete employee');
      } else {
        setChildren('Employee deleted successfully');
      }
    } catch (error) {
      setChildren(error);
    }
    setIsToConfirm(false);
    setModalDisplay(true);
  };

  const columns = [
    { heading: 'ID', value: '_id' },
    { heading: 'Name', value: 'name' },
    { heading: 'Last Name', value: 'lastName' },
    { heading: 'Email', value: 'email' },
    { heading: 'DNI', value: 'dni' },
    { heading: 'Phone', value: 'phone' },
    { heading: 'Actions' }
  ];

  return (
    <section className={styles.container}>
      {!fetching ? (
        <>
          <Table
            title="Employees"
            data={employees}
            columns={columns}
            deleteItem={(id) => {
              setIsToConfirm(true);
              setModalDisplay(true);
              setId(id);
              setChildren('¿Are you sure you want to delete it?');
            }}
            edit="/employees/form"
          />
        </>
      ) : (
        <Spinner />
      )}
      {modalDisplay ? (
        <Modal
          title={'Delete employee'}
          setModalDisplay={setModalDisplay}
          isToConfirm={isToConfirm}
          onClickFunction={() => deleteItem(id)}
        >
          {children}
        </Modal>
      ) : null}
    </section>
  );
}

export default Employees;
