import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import useCurrentUser from '@hooks/useCurrentUser';

import { Stack, Button } from '@chakra-ui/core';
import EmotionList from '@components/emotionViewer/list';
import EmotionBeeswarm from '@components/emotionViewer/beeswarm';

const EmotionViewer = () => {
  const userStore = useCurrentUser();

  const [view, setView] = useState('chart');

  return (
    <>
      <Stack isInline align='center'>
        <Button
          type='button'
          size='xs'
          variant='outline'
          variantColor={view === 'chart' ? 'primary' : 'gray'}
          onClick={() => setView('chart')}>
          chart
        </Button>
        <Button
          type='button'
          size='xs'
          variant='outline'
          variantColor={view === 'list' ? 'primary' : 'gray'}
          onClick={() => setView('list')}>
          list
        </Button>
      </Stack>
      {view === 'list' && (
        <EmotionList emotions={userStore.currentUser.emotions} />
      )}
      {view === 'chart' && (
        <EmotionBeeswarm emotions={userStore.currentUser.emotions} />
      )}
    </>
  );
};

export default observer(EmotionViewer);
