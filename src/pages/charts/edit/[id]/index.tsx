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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getChartById, updateChartById } from 'apiSdk/charts';
import { Error } from 'components/error';
import { chartValidationSchema } from 'validationSchema/charts';
import { ChartInterface } from 'interfaces/chart';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CustomerInterface } from 'interfaces/customer';
import { AstrologerInterface } from 'interfaces/astrologer';
import { getCustomers } from 'apiSdk/customers';
import { getAstrologers } from 'apiSdk/astrologers';

function ChartEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ChartInterface>(
    () => (id ? `/charts/${id}` : null),
    () => getChartById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ChartInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateChartById(id, values);
      mutate(updated);
      resetForm();
      router.push('/charts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ChartInterface>({
    initialValues: data,
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
            Edit Chart
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(ChartEditPage);
