"use client";

interface ReadingTimeProps {
  text: string | number;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ text }) => {
  const textStr = typeof text === "number" ? text.toString() : text;
  const wordsPerMinute = 210; // Average reading speed of an adult
  const words = textStr.split(/\s+/).length; // Split by whitespace and count words
  const minutes = Math.ceil(words / wordsPerMinute);

  return (
    <p>
      Estimated reading time: {minutes} min{minutes !== 1 ? "s" : ""}
    </p>
  );
};

export default ReadingTime;
