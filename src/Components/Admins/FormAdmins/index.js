import React, { useEffect, useState } from 'react';
import Form from 'Components/Shared/Form';
import Modal from 'Components/Shared/Modal';
import Input from 'Components/Shared/Input';
import Spinner from 'Components/Shared/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { createAdmin, editAdmin } from 'redux/admins/thunks';
import { setFetching } from 'redux/admins/actions';
import { useForm } from 'react-hook-form';
import { schemaEdit, schemaCreate } from 'Components/Admins/FormAdmins/validations';
import { joiResolver } from '@hookform/resolvers/joi';

const FormAdmins = () => {
  const urlValues = window.location.search;
  const urlParams = new URLSearchParams(urlValues);
  const id = urlParams.get('id');
  const idRegEx = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
  const rowId = idRegEx.test(id);
  const { children, modalTitle, fetching } = useSelector((state) => state.admins);
  const dispatch = useDispatch();
  const [modalDisplay, setModalDisplay] = useState('');
  const token = sessionStorage.getItem('token');
  const [values, setValues] = useState({
    name: '',
    lastName: '',
    email: '',
    dni: '',
    phone: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(rowId ? schemaEdit : schemaCreate),
    defaultValues: values
  });

  useEffect(async () => {
    if (rowId) {
      dispatch(setFetching(true));
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admins/${id}`, {
          headers: { token }
        });
        const data = await response.json();
        setValues({
          name: data.data.name,
          lastName: data.data.lastName,
          email: data.data.email,
          dni: data.data.dni,
          phone: data.data.phone
        });
      } catch (error) {
        console.error(error);
      }
      dispatch(setFetching(false));
    }
  }, []);

  useEffect(() => {
    reset(values);
  }, [values]);

  const addAdmin = (data) => {
    dispatch(createAdmin(data));
    setModalDisplay(true);
  };

  const putAdmin = (data) => {
    dispatch(editAdmin(id, data));
    setModalDisplay(true);
  };

  const onSubmit = async (data) => {
    if (rowId) {
      putAdmin(data);
      setValues(data);
    } else {
      addAdmin(data);
    }
  };

  const resetForm = () => {
    reset(values);
  };

  return (
    <>
      <Form
        onSubmitFunction={handleSubmit(onSubmit)}
        buttonMessage={rowId ? 'Edit' : 'Create'}
        formTitle={rowId ? 'Edit Admin' : 'Create Admin'}
        resetFunction={() => resetForm()}
      >
        {!fetching ? (
          <>
            <Input register={register} name="name" title="Name" error={errors.name?.message} />
            <Input
              register={register}
              name="lastName"
              title="Last Name"
              error={errors.lastName?.message}
            />
            <Input register={register} name="email" title="Email" error={errors.email?.message} />
            {!rowId && (
              <Input
                register={register}
                name="password"
                title="Password"
                error={errors.password?.message}
                type="password"
              />
            )}
            <Input register={register} name="dni" title="DNI" error={errors.dni?.message} />
            <Input register={register} name="phone" title="Phone" error={errors.phone?.message} />
          </>
        ) : (
          <Spinner />
        )}
      </Form>
      {modalDisplay && !fetching ? (
        <Modal title={modalTitle} setModalDisplay={setModalDisplay}>
          {children}
        </Modal>
      ) : null}
    </>
  );
};

export default FormAdmins;
