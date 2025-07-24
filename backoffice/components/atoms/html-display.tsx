import React from 'react';
import { BasePropertyProps } from 'adminjs';
import { Box, Label } from '@adminjs/design-system';

// Shared Rich Text Editor Styles
export const richTextEditorStyles = `
  ul { 
    list-style-type: disc !important; 
    list-style-position: outside !important; 
    margin: 8px 0 !important; 
    padding-left: 24px !important; 
  }
  ol { 
    list-style-type: decimal !important; 
    list-style-position: outside !important; 
    margin: 8px 0 !important; 
    padding-left: 24px !important; 
  }
  li { 
    display: list-item !important; 
    list-style: inherit !important; 
    margin: 4px 0 !important; 
  }
  b { 
    font-weight: bold !important; 
  }
  i { 
    font-style: italic !important; 
  }
  h1 { 
    font-size: 1.5em !important; 
    font-weight: bold !important; 
    margin: 16px 0 !important; 
  }
  h2 { 
    font-size: 1.25em !important; 
    font-weight: bold !important; 
    margin: 12px 0 !important; 
  }
  .rsw-dd option[value="3"] { 
    display: none !important; 
  }
`;

const HtmlDisplay: React.FC<BasePropertyProps> = (props) => {
  const { property, record, where } = props;
  const value = record?.params?.[property.path] || '';

  if (where === 'list') {
    if (!value || value === '<br>') {
      return null; // Do not render anything if value is empty or just a line break
    }
    return <Label>Check inside</Label>;
  }

  return value && value !== '<br>' ? (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      <Label>{property.label}</Label>
      {value && value != '<br>' && (
        <Box
          mt="sm"
          p="md"
          border="1px solid #e5e5e5"
          borderRadius="4px"
          bg="white"
          style={{
            minHeight: '50px',
          }}
        >
          <div>
            <style>{richTextEditorStyles}</style>
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              style={{
                lineHeight: '1.2',
                color: '#333',
              }}
            />
          </div>
        </Box>
      )}
    </div>
  ) : null;
};

export default HtmlDisplay;
