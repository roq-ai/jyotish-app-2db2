import * as yup from 'yup';

export const chartValidationSchema = yup.object().shape({
  divisional_chart: yup.string().required(),
  planetary_combinations: yup.string().required(),
  customer_id: yup.string().nullable().required(),
  astrologer_id: yup.string().nullable().required(),
});
