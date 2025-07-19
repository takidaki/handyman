
import React from 'react';

interface FormattedResponseProps {
  content: string;
}

const FormattedResponse: React.FC<FormattedResponseProps> = ({ content }) => {
  const formattedContent = React.useMemo(() => {
    return content
      .split('\n')
      .map((line, index) => {
        line = line.trim();
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h3 key={index} className="text-lg font-bold text-brand-green-900 mt-4 mb-2">{line.slice(2, -2)}</h3>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.slice(2)}</li>;
        }
        if (/^\d+\.\s/.test(line)) {
            return <li key={index} className="ml-5 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  }, [content]);

  return <div className="prose prose-sm max-w-none text-gray-800">{formattedContent}</div>;
};

export default FormattedResponse;
