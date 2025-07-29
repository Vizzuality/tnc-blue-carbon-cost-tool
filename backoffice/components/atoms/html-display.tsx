import React from 'react';
import { BasePropertyProps, useTranslation } from 'adminjs';
import { Box, Label } from '@adminjs/design-system';

// Shared Rich Text Editor Styles
export const richTextEditorStyles = `
  .html-display ul { 
    list-style-type: disc !important; 
    list-style-position: outside !important; 
    margin: 8px 0 !important; 
    padding-left: 24px !important; 
  }
  .html-display ol { 
    list-style-type: decimal !important; 
    list-style-position: outside !important; 
    margin: 8px 0 !important; 
    padding-left: 24px !important; 
  }
  .html-display li { 
    display: list-item !important; 
    list-style: inherit !important; 
    margin: 4px 0 !important; 
  }
  .html-display b { 
    font-weight: bold !important; 
  }
  .html-display i { 
    font-style: italic !important; 
  }
  .html-display h1 { 
    font-size: 1.5em !important; 
    font-weight: bold !important; 
    margin: 16px 0 !important; 
  }
  .html-display h2 { 
    font-size: 1.25em !important; 
    font-weight: bold !important; 
    margin: 12px 0 !important; 
  }
  .html-display .rsw-dd option[value="3"] { 
    display: none !important; 
  }
`;

const HtmlDisplay: React.FC<BasePropertyProps> = (props) => {
  const { translateProperty } = useTranslation();
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
      <Label style={{ color: 'rgb(137, 138, 154)' }}>
        {translateProperty(property.label, property.resourceId)}
      </Label>
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
          <div className="html-display" style={{ width: '100%' }}>
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
