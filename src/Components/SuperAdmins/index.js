import { useEffect, useState } from 'react';
import styles from './super-admins.module.css';
import Table from '../Shared/Table';
import Modal from '../Shared/Modal';
import { Link } from 'react-router-dom';
import Spinner from '../Shared/Spinner';

function SuperAdmins() {
  const [superAdmins, saveSuperAdmins] = useState([]);

  const [modalDisplay, setModalDisplay] = useState('');
  const [children, setChildren] = useState('');
  const [isToConfirm, setIsToConfirm] = useState(false);
  const [id, setId] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/super-admins`);
      const data = await response.json();
      if (response.ok) {
        saveSuperAdmins(data.data);
      } else {
        saveSuperAdmins([]);
      }
      setFetching(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteSuperAdmin = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/super-admins/${id}`, {
        method: 'DELETE'
      });
      const newSuperAdmins = superAdmins.filter((superAdmin) => superAdmin._id !== id);
      saveSuperAdmins(newSuperAdmins);
      if (!response.ok) {
        setChildren('Cannot delete super admin');
      } else {
        setChildren('Super Admin deleted successfully');
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
      <h2 className={styles.super__admin__h2}>Super Admins</h2>
      {!fetching ? (
        <>
          <Table
            data={superAdmins}
            columns={columns}
            deleteSuperAdmin={(id) => {
              setIsToConfirm(true);
              setModalDisplay(true);
              setId(id);
              setChildren('¿Are you sure you want to delete it?');
            }}
            edit="/super-admins/form"
          />
          <Link to="/super-admins/form" className={styles.newSuperAdmins}>
            +
          </Link>
        </>
      ) : (
        <Spinner />
      )}
      {modalDisplay ? (
        <Modal
          title={'Delete super admin'}
          setModalDisplay={setModalDisplay}
          isToConfirm={isToConfirm}
          onClickFunction={() => deleteSuperAdmin(id)}
        >
          {children}
        </Modal>
      ) : null}
    </section>
  );
}

export default SuperAdmins;
