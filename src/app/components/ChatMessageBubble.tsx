import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant';
  content?: string;
  children?: React.ReactNode;
}

export default function ChatMessageBubble({ role, content, children }: ChatMessageBubbleProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{ alignSelf: role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
      aria-label={`${role === 'user' ? 'User' : 'Assistant'} message`}
    >
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', mb: 0.5, display: 'block', px: 1 }}
      >
        {role === 'user' ? 'You' : 'AI Assistant'}
      </Typography>
      <Box
        sx={{
          bgcolor: role === 'user' ? 'action.selected' : 'background.default',
          color: 'text.primary',
          p: 1.5,
          borderRadius: 2,
          width: 'fit-content',
          ml: role === 'assistant' ? 0 : 'auto',
        }}
      >
        {content ? (
          <MarkdownRenderer content={content} sanitize={true} variant="compact" />
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
