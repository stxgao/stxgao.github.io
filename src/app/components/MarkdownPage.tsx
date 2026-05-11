import { Alert, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import { useAppStore } from '../store/useAppStore';

interface Props {
  path: string;
}

/**
 * Page component that fetches and renders markdown content.
 */
export default function MarkdownPage({ path }: Props) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { pathname } = useLocation();
  const { isMobile, setIsSidebarExpanded, pageContents } = useAppStore();

  useEffect(() => {
    const fileName = path.split('/').pop() || '';
    const cached = pageContents[fileName];

    if (cached) {
      setContent(cached);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setError(null);

    fetch(path, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load markdown: ${res.statusText}`);
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError(err.message);
          if (isMobile) {
            setIsSidebarExpanded(false);
          }
        }
      });

    return () => controller.abort();
  }, [path, isMobile, setIsSidebarExpanded, pageContents]);

  // Close sidebar on mobile only after content is loaded and painted
  useEffect(() => {
    if (isMobile && content) {
      // Use requestAnimationFrame to ensure the content has been painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSidebarExpanded(false);
        });
      });
    }
  }, [content, isMobile, setIsSidebarExpanded]);

  useEffect(() => {
    let title = pathname.substring(1, pathname.length);
    if (title) {
      title = title[0].toUpperCase() + title.substring(1);
      document.title = `${import.meta.env.VITE_APP_NAME} | ${title}`;
    }
  }, [pathname]);

  return (
    <Container sx={{ color: 'text.primary', py: 2 }}>
      {error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <MarkdownRenderer content={content} sanitize={false} variant="default" />
      )}
    </Container>
  );
}
