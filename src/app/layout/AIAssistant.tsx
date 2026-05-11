import {
  Box,
  Typography,
  TextField,
  IconButton,
  useTheme,
  Button,
  LinearProgress,
  Tooltip,
  Stack,
  styled,
  keyframes,
} from '@mui/material';
import { VscSend, VscTrash, VscCloudDownload, VscDebugStop } from 'react-icons/vsc';
import { useState, useRef, useEffect } from 'react';
import ChatMessageBubble from '../components/ChatMessageBubble';
import { useAIStore } from '../store/useAIStore';
import { useAppStore } from '../store/useAppStore';

const typingAnimation = keyframes`
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const Dot = styled('span')(({ theme }) => ({
  animation: `${typingAnimation} 1.4s infinite both`,
  '&:nth-of-type(2)': { animationDelay: '0.2s' },
  '&:nth-of-type(3)': { animationDelay: '0.4s' },
  fontSize: '1.5rem',
  lineHeight: 0,
  display: 'inline-block',
  margin: '0 1px',
}));

export default function AIAssistant() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const {
    messages,
    aiStatus,
    isThinking,
    isGenerating,
    downloadProgress,
    initAI,
    handleSend,
    handleStop,
    handleDownload,
    clearChat,
  } = useAIStore();

  const { pageContents } = useAppStore();

  // Synthesize Home page context since it's not a markdown file
  const homePageContext = `FILE: Home Page (index)\nCONTENT:\nName: Steven Gao\nTitle: Software Engineer, UI/UX 📍 San Francisco\nLinks: GitHub (https://github.com/stxgao), LinkedIn (https://www.linkedin.com/in/stxgao/), Email (steven@stevengao.dev), Resume (steven_gao_resume.pdf)`;

  // Aggregate all preloaded markdown content to provide as context
  const portfolioContext = [
    homePageContext,
    ...Object.entries(pageContents).map(([name, content]) => `FILE: ${name}\nCONTENT:\n${content}`),
  ].join('\n\n---\n\n');

  useEffect(() => {
    initAI();
  }, [initAI]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Check if user is within 50px of the bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    isAtBottomRef.current = atBottom;
  };

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, isGenerating, isThinking, aiStatus, downloadProgress]);

  const onSend = () => {
    if (isGenerating) {
      handleStop();
    } else if (input.trim()) {
      isAtBottomRef.current = true; // Force scroll to bottom when user sends a message
      handleSend(input, portfolioContext);
      setInput('');
    }
  };

  const onExport = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `chat-history-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1, minHeight: 0 }}
    >
      {/* Panel Header Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: theme.layout.tabHeight,
          pl: 3,
          pr: 1,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: '0.05em' }}
        >
          AI ASSISTANT
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Export Chat" arrow>
            <span>
              <IconButton
                size="small"
                onClick={onExport}
                disabled={messages.length <= 1}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  '&.Mui-disabled': { color: 'text.secondary', opacity: 0.3 },
                }}
              >
                <VscCloudDownload fontSize={18} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Clear Chat" arrow>
            <span>
              <IconButton
                size="small"
                onClick={clearChat}
                disabled={messages.length <= 1}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  '&.Mui-disabled': { color: 'text.secondary', opacity: 0.3 },
                }}
              >
                <VscTrash fontSize={18} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* Chat History */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          ref={scrollContainerRef}
          onScroll={handleScroll}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 2,
          }}
        >
          {messages.map((msg, idx) => (
            <ChatMessageBubble
              key={msg.id || idx}
              role={msg.role}
              content={msg.content.trimEnd()}
            />
          ))}
          {aiStatus === 'downloading' && (
            <ChatMessageBubble role="assistant">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Downloading Gemini Nano model...
              </Typography>
              <LinearProgress
                variant={downloadProgress > 0 ? 'determinate' : 'indeterminate'}
                value={downloadProgress}
                sx={{ borderRadius: 1 }}
              />
              <Typography
                variant="caption"
                sx={{ mt: 1, display: 'block', textAlign: 'right', color: 'text.secondary' }}
              >
                {downloadProgress > 0 ? `${Math.round(downloadProgress)}%` : 'Starting...'}
              </Typography>
            </ChatMessageBubble>
          )}
          {isThinking && (
            <ChatMessageBubble role="assistant">
              <Box sx={{ display: 'flex', alignItems: 'center', height: 20, py: 1 }}>
                <Dot>.</Dot>
                <Dot>.</Dot>
                <Dot>.</Dot>
              </Box>
            </ChatMessageBubble>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            background: `linear-gradient(to bottom, transparent, ${theme.palette.background.paper})`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Input Area */}
      {aiStatus === 'downloadable' ? (
        <Box sx={{ p: 2, pt: 0, bgcolor: 'background.paper', flexShrink: 0 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleDownload(portfolioContext)}
            sx={{
              bgcolor: 'primary.main',
              color: 'background.default',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'text.active',
              },
            }}
          >
            Download Gemini Nano (~1.5GB)
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2, pt: 0, bgcolor: 'background.paper', flexShrink: 0 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            maxRows={4}
            placeholder={aiStatus === 'available' ? 'Ask me anything...' : 'AI is unavailable'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiStatus !== 'available'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={onSend}
                  disabled={(!input.trim() && !isGenerating) || aiStatus !== 'available'}
                  sx={{
                    color: 'markdownIcon',
                    '&.Mui-disabled': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  {isGenerating ? <VscDebugStop /> : <VscSend />}
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                ...theme.typography.body2,
                color: 'text.primary',
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 1.5,
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'text.secondary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'text.primary',
                },
                '&.Mui-disabled': {
                  opacity: 0.6,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
