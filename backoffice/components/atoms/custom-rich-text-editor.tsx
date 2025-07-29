import React from 'react';
import { BasePropertyProps, useTranslation } from 'adminjs';
import { Box, Label, Text, FormGroup } from '@adminjs/design-system';
import Editor, {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
  BtnUndo,
  BtnRedo,
  Toolbar,
  BtnStyles,
} from 'react-simple-wysiwyg';

// Shared Rich Text Editor Styles
export const richTextEditorStyles = `
  div[contenteditable="true"] ul { 
    list-style-type: disc !important; 
    list-style-position: outside !important; 
    margin: 8px 0 !important; 
    padding-left: 24px !important; 
  }
  div[contenteditable="true"] ol { 
    list-style-type: decimal !important; 
    list-style-position: outside !important; 
    margin: 8px 0 !important; 
    padding-left: 24px !important; 
  }
  div[contenteditable="true"] li { 
    display: list-item !important; 
    list-style: inherit !important; 
    margin: 4px 0 !important; 
  }
  div[contenteditable="true"] b { 
    font-weight: bold !important; 
  }
  div[contenteditable="true"] i { 
    font-style: italic !important; 
  }
  div[contenteditable="true"] h1 { 
    font-size: 1.5em !important; 
    font-weight: bold !important; 
    margin: 16px 0 !important; 
  }
  div[contenteditable="true"] h2 { 
    font-size: 1.25em !important; 
    font-weight: bold !important; 
    margin: 12px 0 !important; 
  }
  .rsw-dd option[value="3"] { 
    display: none !important; 
  }
`;

// Shared Rich Text Editor Component
interface SharedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  error?: string;
}

export const SharedRichTextEditor: React.FC<SharedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text (optional)',
  minHeight = '200px',
  error,
}) => {
  const handleChange = (e: any) => {
    if (e.target.value === '<br>') e.target.value = null; // Handle empty value
    onChange(e.target.value);
  };

  return (
    <>
      <style>{richTextEditorStyles}</style>
      <Editor
        tagName="div"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          minHeight,
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <Toolbar>
          <BtnUndo />
          <BtnRedo />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnBulletList />
          <BtnNumberedList />
          <BtnStyles />
        </Toolbar>
      </Editor>
    </>
  );
};

// AdminJS Component Wrapper
const CustomRichTextEditor: React.FC<BasePropertyProps> = (props) => {
  const { translateProperty } = useTranslation();
  const { property, record, onChange } = props;
  const value = record?.params?.[property.path] || '';
  const error = record?.errors?.[property.path]?.message;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(property.path, newValue);
    }
  };

  return (
    <Box mb="xl" width="100%">
      <Label htmlFor={property.path} required={property.isRequired}>
        {translateProperty(property.label, property.resourceId)}
      </Label>

      <SharedRichTextEditor
        value={value}
        onChange={handleValueChange}
        placeholder="Enter version notes (optional)"
        error={error}
      />

      {error && (
        <Text mt="sm" color="error">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default CustomRichTextEditor;
