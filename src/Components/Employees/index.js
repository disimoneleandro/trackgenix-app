import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployees, deleteEmployees } from 'redux/employees/thunks';
import styles from 'Components/Employees/employees.module.css';
import Modal from 'Components/Shared/Modal';
import Spinner from 'Components/Shared/Spinner';
import Table from 'Components/Shared/Table';
import { setModalTitle, setModalContent } from 'redux/employees/actions';

function Employees() {
  const {
    list: employees,
    fetching,
    children,
    error,
    modalTitle
  } = useSelector((state) => state.employees);
  const { data } = useSelector((state) => state.auth);

  const [modalDisplay, setModalDisplay] = useState('');
  const [isToConfirm, setIsToConfirm] = useState(false);
  const [id, setId] = useState('');
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getEmployees());
  }, []);

  const removeEmployees = (id) => {
    dispatch(deleteEmployees(id));
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
    data !== 'EMPLOYEE' && { heading: 'Actions' }
  ];

  return (
    <section className={styles.container}>
      {!fetching ? (
        <>
          <Table
            title="Employees"
            data={employees}
            columns={columns}
            error={error}
            deleteItem={(id) => {
              dispatch(setModalTitle('Delete'));
              dispatch(setModalContent('Are you sure you want to delete it?'));
              setIsToConfirm(true);
              setModalDisplay(true);
              setId(id);
            }}
            edit="/employees/form"
            canCreate={data === 'ADMIN' || data === 'SUPER_ADMIN'}
          />
        </>
      ) : (
        <Spinner />
      )}
      {modalDisplay ? (
        <Modal
          title={modalTitle}
          setModalDisplay={setModalDisplay}
          isToConfirm={isToConfirm}
          onClickFunction={() => removeEmployees(id)}
        >
          {children}
        </Modal>
      ) : null}
    </section>
  );
}

export default Employees;
