import React from 'react';
import { Form, Formik } from 'formik';
import { Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box } from "@chakra-ui/react";
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Input } from '@chakra-ui/core';


interface registerProps {}

// This has been created through graphql-codgen
// Below Schema has been moved into graphql/mutations
// After you run yarn gen, it would create separate generated/graphql.tsx
// and create a separate function, useRegisterMutation.

// const REGISTER_MUT = `
// mutation Register($username: String!, $password: String!) {
//   register(options: { username: $username, password: $password}) {
//     errors {
//       field
//       message
//     }
//     user {
//       id
//       username
//     }
//   }
// }`;

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik 
        initialValues={{email: '', username: '', password: ''}}
        onSubmit={async (values, { setErrors }) => { 
          const response = await register({ options: values });
          
          if(response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if(response.data?.register.user) {
            // worked
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name="username" 
              placeholder="username" 
              label="Username"
            />

            <Box mt={4}>
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            
            <Box mt={4}>
              <InputField 
                name="password" 
                placeholder="password" 
                label="Password"
                type="password"
              />
            </Box>

            <Button mt={4} type='submit' colorScheme="teal" isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Register);
