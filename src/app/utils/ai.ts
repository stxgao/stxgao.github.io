/**
 * Utility to parse assistant messages for thought blocks.
 * Supports partial (streaming) and complete thought blocks.
 */
export const parseMessageThoughts = (content: string, role: string, isLast: boolean) => {
  const thoughtStartTag = '<thought>';
  const thoughtEndTag = '</thought>';

  // Case 1: Initial empty state or start of a thought tag for assistant
  const isPotentiallyStartingThought =
    role === 'assistant' &&
    isLast &&
    content.length > 0 &&
    content.length < thoughtStartTag.length &&
    thoughtStartTag.startsWith(content);

  if ((role === 'assistant' && content === '' && isLast) || isPotentiallyStartingThought) {
    return { thought: '', cleanContent: null, isComplete: false };
  }

  const startIndex = content.indexOf(thoughtStartTag);
  const endIndex = content.indexOf(thoughtEndTag);

  // Case 2: We found a thought block (partial or complete)
  if (startIndex !== -1) {
    const isComplete = endIndex !== -1;
    const thought = isComplete
      ? content.substring(startIndex + thoughtStartTag.length, endIndex).trim()
      : content.substring(startIndex + thoughtStartTag.length).trimStart();

    const cleanContent = isComplete
      ? content.substring(endIndex + thoughtEndTag.length).trim()
      : null;

    return { thought, cleanContent, isComplete };
  }

  // Case 3: No thought tag found
  // If we're not inside a thought block, show the content immediately
  return {
    thought: null,
    cleanContent: content,
    isComplete: true,
  };
};
