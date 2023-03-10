import { useEffect, useState } from 'react';
import Modal from 'Components/Shared/Modal';
import Form from 'Components/Shared/Form';
import Input from 'Components/Shared/Input';
import Spinner from 'Components/Shared/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee, editEmployee } from 'redux/employees/thunks';
import { setFetching } from 'redux/employees/actions';
import { useForm } from 'react-hook-form';
import { schemaEdit, schemaCreate } from 'Components/Employees/Form/validations';
import { joiResolver } from '@hookform/resolvers/joi';

function EmployeeForm() {
  const dispatch = useDispatch();
  const { children, modalTitle, fetching } = useSelector((state) => state.employees);
  const urlValues = window.location.search;
  const urlParams = new URLSearchParams(urlValues);
  const product = urlParams.get('id');
  const idRegEx = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
  const rowId = idRegEx.test(product);
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/employees/${product}`, {
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

  const postEmployee = (data) => {
    dispatch(createEmployee(data));
    setModalDisplay(true);
  };

  const putEmployee = (data) => {
    dispatch(editEmployee(product, data));
    setModalDisplay(true);
  };

  const onSubmit = async (data) => {
    if (rowId) {
      putEmployee(data);
      setValues(data);
    } else {
      postEmployee(data);
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
        formTitle={rowId ? 'Edit Employee' : 'Create Employee'}
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
}

export default EmployeeForm;
