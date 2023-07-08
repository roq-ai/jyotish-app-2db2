import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  birth_time: yup.date().required(),
  birth_date: yup.date().required(),
  birth_place: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
