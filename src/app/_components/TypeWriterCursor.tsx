interface TypewriterCursorProps {
  show: boolean;
  typingComplete: boolean;
}

const TypewriterCursor = ({ show, typingComplete }: TypewriterCursorProps) => {
  if (typingComplete) return null;

  return (
    <span
      className={`inline-block w-[0.5em] whitespace-nowrap ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      &nbsp;| {/* Use non-breaking space before cursor */}
    </span>
  );
};

export default TypewriterCursor;
