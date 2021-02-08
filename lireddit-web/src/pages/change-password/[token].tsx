import { Box, Button, Link, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

export const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik 
        initialValues={{ newPassword: ''}}
        onSubmit={async (values, { setErrors }) => { 
          const response = await changePassword({
            newPassword: values.newPassword,
            token: typeof router.query.token === 'string' ? router.query.token : ''
          });
          
          if(response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)

            if('token' in errorMap) {
              setTokenError(errorMap.token);
            } 
            
            setErrors(errorMap);

            setErrors(toErrorMap(response.data.changePassword.errors))
          } else if(response.data?.changePassword.user) {
            // worked
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField 
              name="newPassword" 
              placeholder="new password" 
              label="New Password"
              type="password"
            />
            { tokenError ? (
              <Flex> 
                <Box mr={4} color="red">{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Click here to get new password</Link>
                </NextLink>
              </Flex>
            )
            : null }
            <Button mt={4} type='submit' colorScheme="teal" isLoading={isSubmitting}>
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ChangePassword);