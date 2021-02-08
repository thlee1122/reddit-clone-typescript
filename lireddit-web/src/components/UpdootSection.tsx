import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  return (
    <Flex 
      direction="column" 
      justifyContent="center" 
      alignItems="center" 
      mr={4}
    >
      <ChevronUpIcon
        color={post.voteStatus === 1 ? "green.500" : undefined}
        w={8} h={8} 
        onClick={async () => {
          if(post.voteStatus === 1) {
            return;
          }
          await vote({
            postId: post.id,
            value: 1
          });
        }}
      />
      {post.points}
      <ChevronDownIcon 
      color={post.voteStatus === -1 ? "red.500" : undefined}
        onClick={async () => {
          if(post.voteStatus === -1) {
            return;
          }

          await vote({
            postId: post.id,
            value: -1
          });
        }}
        w={8} h={8} 
      />
    </Flex>
  )
}
