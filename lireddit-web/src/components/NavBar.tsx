import { Box, Link, Flex, Button, Heading } from '@chakra-ui/react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import NextLink from 'next/link';
import {useRouter} from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });
  let body = null;

  // data is loading
  if(fetching) {
    
    // user not logged in
  } else if(!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link color="white" mr={2}>Login</Link>  
        </NextLink>

        <NextLink href='/register'>
          <Link color="white">Register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>Create Post</Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button 
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
      
    )
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg='tomato' p={4}>
      <Flex flex={1} align="center" maxW={800} margin="auto">
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        
        <Box ml={"auto"}>
          { body }
        </Box>
      </Flex>
    </Flex>
  );
}