import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createChart } from 'apiSdk/charts';
import { Error } from 'components/error';
import { chartValidationSchema } from 'validationSchema/charts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CustomerInterface } from 'interfaces/customer';
import { AstrologerInterface } from 'interfaces/astrologer';
import { getCustomers } from 'apiSdk/customers';
import { getAstrologers } from 'apiSdk/astrologers';
import { ChartInterface } from 'interfaces/chart';

function ChartCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ChartInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createChart(values);
      resetForm();
      router.push('/charts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ChartInterface>({
    initialValues: {
      divisional_chart: '',
      planetary_combinations: '',
      customer_id: (router.query.customer_id as string) ?? null,
      astrologer_id: (router.query.astrologer_id as string) ?? null,
    },
    validationSchema: chartValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Chart
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="divisional_chart" mb="4" isInvalid={!!formik.errors?.divisional_chart}>
            <FormLabel>Divisional Chart</FormLabel>
            <Input
              type="text"
              name="divisional_chart"
              value={formik.values?.divisional_chart}
              onChange={formik.handleChange}
            />
            {formik.errors.divisional_chart && <FormErrorMessage>{formik.errors?.divisional_chart}</FormErrorMessage>}
          </FormControl>
          <FormControl id="planetary_combinations" mb="4" isInvalid={!!formik.errors?.planetary_combinations}>
            <FormLabel>Planetary Combinations</FormLabel>
            <Input
              type="text"
              name="planetary_combinations"
              value={formik.values?.planetary_combinations}
              onChange={formik.handleChange}
            />
            {formik.errors.planetary_combinations && (
              <FormErrorMessage>{formik.errors?.planetary_combinations}</FormErrorMessage>
            )}
          </FormControl>
          <AsyncSelect<CustomerInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select Customer'}
            placeholder={'Select Customer'}
            fetcher={getCustomers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.birth_place}
              </option>
            )}
          />
          <AsyncSelect<AstrologerInterface>
            formik={formik}
            name={'astrologer_id'}
            label={'Select Astrologer'}
            placeholder={'Select Astrologer'}
            fetcher={getAstrologers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'chart',
    operation: AccessOperationEnum.CREATE,
  }),
)(ChartCreatePage);
