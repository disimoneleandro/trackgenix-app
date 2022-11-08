import React, { useEffect, useState } from 'react';
import Form from '../../Shared/Form';
import Input from '../../Shared/Input';

const FormAdmins = () => {
  const urlValues = window.location.search;
  const urlParams = new URLSearchParams(urlValues);
  const id = urlParams.get('id');
  const idRegEx = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
  const rowId = idRegEx.test(id);

  const [adminInput, setAdminInput] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    phone: ''
  });

  if (rowId) {
    useEffect(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admins/${id}`);
        const data = await response.json();
        setAdminInput({
          name: data.data.name,
          lastName: data.data.lastName,
          email: data.data.email,
          password: data.data.password,
          dni: data.data.dni,
          phone: data.data.phone
        });
      } catch (error) {
        console.error(error);
      }
    }, []);
  }

  const createAdmin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminInput)
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setAdminInput({
          name: '',
          lastName: '',
          email: '',
          password: '',
          dni: '',
          phone: ''
        });
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const editAdmin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminInput)
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  const onChange = (e) => {
    setAdminInput({ ...adminInput, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    rowId ? editAdmin() : createAdmin();
  };

  return (
    //<h2 className={styles.h2__form}>{rowId ? 'Edit' : 'Create'}</h2>

    <Form
      onChange={() => onChange()}
      onSubmitFunction={onSubmit}
      buttonMessage={rowId ? 'Edit' : 'Create'}
      formTitle={rowId ? 'Edit Admin' : 'Create Admin'}
    >
      <Input name="name" title="Name" value={adminInput.name} onChange={onChange} />
      <Input name="lastName" title="Last Name" value={adminInput.lastName} onChange={onChange} />
      <Input name="email" title="Email" value={adminInput.email} onChange={onChange} />
      <Input
        name="password"
        title="Password"
        value={adminInput.password}
        onChange={onChange}
        type="password"
      />
      <Input name="dni" title="DNI" value={adminInput.dni} onChange={onChange} />
      <Input name="phone" title="Phone" value={adminInput.phone} onChange={onChange} />
      {/* <form onSubmit={onSubmit} className={styles.form__admins}>
        <div>
          <label>Name</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={adminInput.name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            className={styles.input}
            type="text"
            name="lastName"
            value={adminInput.lastName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            className={styles.input}
            type="text"
            name="email"
            value={adminInput.email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            className={styles.input}
            type="text"
            name="password"
            value={adminInput.password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>DNI</label>
          <input
            className={styles.input}
            type="text"
            name="dni"
            value={adminInput.dni}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            className={styles.input}
            type="text"
            name="phone"
            value={adminInput.phone}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className={`${styles.button__save} ${styles.form__button}`}>
          {rowId ? 'Edit' : 'Create'}
        </button>
      </form> */}
    </Form>
  );
};
export default FormAdmins;
